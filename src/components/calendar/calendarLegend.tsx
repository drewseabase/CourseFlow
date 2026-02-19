import { CalendarEvent } from "@/lib/mock/calendardatagenerator"

interface CalendarLegendProps {
    events: CalendarEvent[];
    viewType: 'day' | 'week' | 'month';
    isOpen: boolean;
    onToggle: () => void;
}

/**
 * Extract unique event categories from events
 * Groups by course name for classes and by type for others
 */
function extractCategories(events: CalendarEvent[]): Array<{label: string; color: string; type: string}>{
    const categoriesMap = new Map<string,{label: string; color :string; type: string}>();

    events.forEach(event =>{
        let key: string;
        let label: string;
        let color: string;

        if(event.type === 'class'){
            key = event.course || event.title;
            label = event.course || event.title;
            color = event.color;
        }else if(event.type === 'work'){
            key = 'work';
            label = 'Work';
            color = event.color;
        }else if (event.type === 'personal'){
            key = 'personal';
            label = 'Personal';
            color = event.color;
        }else if (event.type === 'task'){
            if(event.course){
                key = `task-${event.course}`;
                label = `${event.course}`;
                color = event.color;
            }else{
                key = 'tasks';
                label = 'Tasks';
                color = event.gradientClass || '#8B5CF6';
            }
        }else{
            return;
        }

        if(!categoriesMap.has(key)){
            categoriesMap.set(key, {label, color, type: event.type});
        }
    });

    const categories = Array.from(categoriesMap.values());

    const typeOrder = {class: 1, work: 2, personal: 3, task: 4};
    categories.sort((a,b) =>{
        const orderA = typeOrder[a.type as keyof typeof typeOrder] || 999;
        const orderB = typeOrder[b.type as keyof typeof typeOrder] || 999;
        if(orderA !== orderB) return orderA - orderB;
        return a.label.localeCompare(b.label);
    });

    return categories;
}

/**
 * Render a color swatch
 * Handles both solid colors (hex) and gradient classes 
 */
function ColorSwatch({ color, type }: { color: string; type: string }) {
    const isGradient = color.startsWith('from-');

    if (isGradient) {
        return <div className={`w-2.5 h-2.5 rounded-sm bg-linear-to-br ${color}`} />;
    } else if (type === 'class') {
        return <div className="w-2.5 h-2.5 rounded-sm border-2" style={{ backgroundColor: color, borderColor: color }} />;
    } else {
        return <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }} />;
    }
}

export default function CalendarLegend({ events, viewType, isOpen, onToggle }: CalendarLegendProps) {
    const categories = extractCategories(events);

    // Separate into subjects (classes/tasks with course) and event types
    const subjects = categories.filter(c => c.type === 'class' || (c.type === 'task' && c.label !== 'Tasks'));
    const eventTypes = categories.filter(c => c.type === 'work' || c.type === 'personal' || c.label === 'Tasks');

    const panel =
        'bg-zinc-200/85 backdrop-blur-md border-1 border-stone-400/70 rounded-2xl shadow-sm';

    return (
        <div
            className={`
                shrink-0 flex flex-col gap-2.5 overflow-hidden
                transition-all duration-250
                ${panel}
                ${isOpen ? 'w-40 p-4' : 'w-10 p-2 items-center'}
            `}
        >
            {/* Toggle button */}
            <button
                onClick={onToggle}
                className="w-6 h-6 rounded-md border-[1.5px] border-violet-400/30 bg-violet-500/10 text-violet-700 flex items-center justify-center shrink-0 transition-all duration-150 self-center"
                onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translate(-1px, -1px)';
                    e.currentTarget.style.boxShadow = '2px 2px 0px 0px #18181B';
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translate(0, 0)';
                    e.currentTarget.style.boxShadow = 'none';
                }}
                onMouseDown={e => {
                    e.currentTarget.style.transform = 'translate(0, 0)';
                    e.currentTarget.style.boxShadow = 'none';
                }}
                aria-label="Toggle legend"
            >
                <svg
                    width="12" height="12"
                    fill="none" stroke="currentColor" strokeWidth="2.5"
                    viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"
                    style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease' }}
                >
                    <polyline points="9 18 15 12 9 6" />
                </svg>
            </button>

            {/* Collapsed: dot stack + vertical label */}
            {!isOpen && categories.length > 0 && (
                <>
                    <div className="flex flex-col gap-1.5 items-center">
                        {categories.slice(0, 5).map((cat) => (
                            <div
                                key={cat.label}
                                className="w-2 h-2 rounded-sm shrink-0"
                                style={{ backgroundColor: cat.color.startsWith('from-') ? '#8B5CF6' : cat.color }}
                            />
                        ))}
                    </div>
                    <span
                        className="text-[9px] font-bold uppercase tracking-[0.12em] text-zinc-400"
                        style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                    >
                        Legend
                    </span>
                </>
            )}

            {/* Expanded: full legend content */}
            {isOpen && (
                <div className="flex flex-col gap-1 w-full">
                    <div className="text-[12px] font-bold text-zinc-900 mb-1">Legend</div>

                    {subjects.length > 0 && (
                        <>
                            <div className="text-[9px] font-bold uppercase tracking-[0.08em] text-zinc-400 mt-1 mb-1">
                                Subjects
                            </div>
                            {subjects.map((cat) => (
                                <div key={cat.label} className="flex items-center gap-2 py-0.5">
                                    <ColorSwatch color={cat.color} type={cat.type} />
                                    <span className="text-[12px] font-600 text-zinc-600 truncate">{cat.label}</span>
                                </div>
                            ))}
                        </>
                    )}

                    {eventTypes.length > 0 && (
                        <>
                            <div className="text-[9px] font-bold uppercase tracking-[0.08em] text-zinc-400 mt-3 mb-1">
                                Event Types
                            </div>
                            {eventTypes.map((cat) => (
                                <div key={cat.label} className="flex items-center gap-2 py-0.5">
                                    <ColorSwatch color={cat.color} type={cat.type} />
                                    <span className="text-[12px] font-600 text-zinc-600 truncate">{cat.label}</span>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
