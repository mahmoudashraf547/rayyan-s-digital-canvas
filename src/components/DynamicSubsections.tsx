import { useCallback, useEffect, useMemo, useState } from "react";
import { useAdmin } from "@/lib/admin-context";

import { supabase } from "@/integrations/supabase/client";

import { AddItemButton } from "./AddItemButton";
import { FileSection } from "./FileSection";
import { Copy, Edit3, Trash2, ArrowUp, ArrowDown } from "lucide-react";

interface Subsection {
  id: string;
  title: string;
  position: number;
}

function uuid() {
  return typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const SUBSECTIONS_SECTION_KEY = "dynamic_subsections";

type DbSubsectionRow = {
  id: string;
  section_key: string;
  title: string | null;
  meta: Record<string, unknown> | null;
  position: number | null;
};

function rowToSubsection(row: DbSubsectionRow): Subsection {
  const meta = row.meta ?? {};
  const subsectionId = typeof meta.id === "string" && meta.id.length > 0 ? meta.id : row.id;
  return {
    id: subsectionId,
    title: row.title ?? "",
    position: typeof row.position === "number" ? row.position : 0,
  };
}

export function DynamicSubsections() {
  const { isAdmin, editMode } = useAdmin();
  const canEdit = isAdmin && editMode;

  const [subsections, setSubsections] = useState<Subsection[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("site_items")
      .select("id, section_key, title, meta, position")
      .eq("section_key", SUBSECTIONS_SECTION_KEY)
      .order("position", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error);
      setSubsections([]);
      setLoading(false);
      return;
    }

    const rows = (data ?? []) as DbSubsectionRow[];
    setSubsections(rows.map(rowToSubsection).sort((a, b) => a.position - b.position));
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
    const ch = supabase
      .channel("dynamic_subsections_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "site_items",
          filter: `section_key=eq.${SUBSECTIONS_SECTION_KEY}`,
        },
        () => reload(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ch);
    };
  }, [reload]);

  const getDbRowIdBySubsectionId = useCallback(async (subsectionId: string) => {
    const { data, error } = await supabase
      .from("site_items")
      .select("id")
      .eq("section_key", SUBSECTIONS_SECTION_KEY)
      // meta->>id works for Postgres jsonb
      .eq("meta->>id", subsectionId)
      .maybeSingle();

    if (error) throw error;
    return (data as { id: string } | null)?.id ?? null;
  }, []);

  const addSubsection = useCallback(async () => {
    const title = window.prompt("أدخل عنوان القسم الفرعي:");
    if (!title || title.trim().length === 0) return;

    const id = uuid();

    const { error } = await supabase.from("site_items").insert({
      section_key: SUBSECTIONS_SECTION_KEY,
      title: title.trim(),
      description: null,
      file_url: null,
      file_type: null,
      meta: { id },
      position: subsections.length,
    });

    if (error) throw error;
    await reload();
  }, [reload, subsections.length]);

  const editSubsectionTitle = useCallback(async (id: string) => {
    const current = subsections.find((item) => item.id === id);
    const title = window.prompt("أدخل عنوان القسم الفرعي الجديد:", current?.title || "");
    if (!title || title.trim().length === 0) return;

    const dbRowId = await getDbRowIdBySubsectionId(id);
    if (!dbRowId) return;

    const { error } = await supabase
      .from("site_items")
      .update({ title: title.trim() } as never)
      .eq("id", dbRowId);

    if (error) throw error;
    await reload();
  }, [getDbRowIdBySubsectionId, reload, subsections]);

  const duplicateSubsection = useCallback(async (id: string) => {
    const current = subsections.find((item) => item.id === id);
    if (!current) return;

    // Create a new subsection id, insert it after the original.
    const insertPosition = subsections.findIndex((s) => s.id === id) + 1;
    const newId = uuid();

    // Shift positions of items at/after insertPosition up by 1.
    const toShift = subsections
      .filter((s) => s.position >= insertPosition)
      .map((s) => s.id);

    await Promise.all(
      toShift.map(async (sid) => {
        const dbRowId = await getDbRowIdBySubsectionId(sid);
        if (!dbRowId) return;
        const { error } = await supabase
          .from("site_items")
          .update({ position: (subsections.find((x) => x.id === sid)?.position ?? 0) + 1 } as never)
          .eq("id", dbRowId);
        if (error) throw error;
      })
    );

    const { error } = await supabase.from("site_items").insert({
      section_key: SUBSECTIONS_SECTION_KEY,
      title: `${current.title} (نسخة)`,
      description: null,
      file_url: null,
      file_type: null,
      meta: { id: newId },
      position: insertPosition,
    });

    if (error) throw error;
    await reload();
  }, [getDbRowIdBySubsectionId, reload, subsections]);

  const deleteSubsection = useCallback(async (id: string) => {
    const idx = subsections.findIndex((s) => s.id === id);
    if (idx < 0) return;

    const dbRowId = await getDbRowIdBySubsectionId(id);
    if (dbRowId) {
      const { error } = await supabase.from("site_items").delete().eq("id", dbRowId);
      if (error) throw error;
    }

    // Shift positions down for items after deleted.
    const deletedPos = subsections[idx]?.position ?? idx;
    const toShift = subsections.filter((s) => s.position > deletedPos).map((s) => s.id);

    await Promise.all(
      toShift.map(async (sid) => {
        const row = subsections.find((x) => x.id === sid);
        if (!row) return;
        const dbRowId2 = await getDbRowIdBySubsectionId(sid);
        if (!dbRowId2) return;
        const { error } = await supabase
          .from("site_items")
          .update({ position: row.position - 1 } as never)
          .eq("id", dbRowId2);
        if (error) throw error;
      })
    );

    await reload();
  }, [getDbRowIdBySubsectionId, reload, subsections]);

  const moveSubsection = useCallback(async (id: string, direction: -1 | 1) => {
    const index = subsections.findIndex((s) => s.id === id);
    const targetIndex = index + direction;
    if (index < 0 || targetIndex < 0 || targetIndex >= subsections.length) return;

    const a = subsections[index];
    const b = subsections[targetIndex];

    const dbRowIdA = await getDbRowIdBySubsectionId(a.id);
    const dbRowIdB = await getDbRowIdBySubsectionId(b.id);
    if (!dbRowIdA || !dbRowIdB) return;

    await Promise.all([
      supabase.from("site_items").update({ position: b.position } as never).eq("id", dbRowIdA),
      supabase.from("site_items").update({ position: a.position } as never).eq("id", dbRowIdB),
    ]);

    await reload();
  }, [getDbRowIdBySubsectionId, reload, subsections]);

  return (
    <div className="mt-10 border-t border-border pt-8">
      {canEdit && (
        <div className="flex justify-end">
          <AddItemButton onClick={addSubsection} label="إضافة قسم فرعي جديد" size="md" />
        </div>
      )}


      <div className="space-y-10 mt-8">
        {subsections.map((subsection) => (
          <div key={subsection.id} className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <h3 className="text-xl sm:text-2xl font-bold gradient-title text-right">{subsection.title}</h3>
              <div className="flex flex-wrap gap-2 justify-start">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-2 text-sm text-violet-700 hover:bg-violet-50"
                  onClick={() => editSubsectionTitle(subsection.id)}
                >
                  <Edit3 className="w-4 h-4" />
                  تحرير العنوان
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-2 text-sm text-violet-700 hover:bg-violet-50"
                  onClick={() => duplicateSubsection(subsection.id)}
                >
                  <Copy className="w-4 h-4" />
                  نسخ
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 hover:bg-red-100 hover:text-red-700 transition"
                  onClick={() => deleteSubsection(subsection.id)}
                >
                  <Trash2 className="w-4 h-4" />
                  حذف
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-2 text-sm text-violet-700 hover:bg-violet-50"
                  onClick={() => moveSubsection(subsection.id, -1)}
                >
                  <ArrowUp className="w-4 h-4" />
                  أعلى
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-2 text-sm text-violet-700 hover:bg-violet-50"
                  onClick={() => moveSubsection(subsection.id, 1)}
                >
                  <ArrowDown className="w-4 h-4" />
                  أسفل
                </button>
              </div>
            </div>

            <div className="rounded-[28px] border border-border/80 bg-white p-6 sm:p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
              <FileSection
                sectionKey={`dynamic.${subsection.id}`}
                title={subsection.title}
                hideTitle
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
                                                                    
                                                                                                                                                                                                                              
                                                                                                

                                                                                      
                                                                                            
                                                                                                          
                                                                                                      
                                                                                                                                                                                                                      
                                                                                                                            
                                                                                                                                            
                                                                                                                                                                   
                                                                                                                                                                                                                                                                                                                                       
                                                                                                                                                                                    

                                                                                                                                                                                      
                                                                                                                                                                          
                                                                                                                                                                                        
                                                                                                                                                                                                    
                                                                                                                                                                                              
                                                                                                                                                                                                                
                                                                                                                                                                                                                      
                                                                                                                                                                                                                              
                                                                                                                                                                                                                                  
                                                                                                                                                                                                                                    
                                                                                                                                                                                                    
                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                    
                                                                                                                                                                                                          
                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                            

                                                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                                                      
                                                                                                                                                                                                                                                                                                            
                                                                                                                                                                                                                                                                                                                    
                                                                                                                                                                                                                                                                                                                          
                                                                                                                                                                                                                                                                                                                                     
                                                                                                                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                                                                                                                            
                                                                                                                                                                                                                                                                                                                                                                                                      
                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                                                                                                                          
                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
                                                                                                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        