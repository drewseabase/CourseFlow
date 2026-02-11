
import { CalendarEvent } from "@/lib/mock/calendardatagenerator"

interface CalendarLegendProps{
    events: CalendarEvent[];
    viewType: 'day' | 'week' | 'month';
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
            //For classes, group by course name
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

    //Convert to array and sort
    const categories = Array.from(categoriesMap.values());

    //Sort: classes first, then work, then personal,then tasks
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
function ColorSwatch({color, type} : {color: string; type: string}){
    //Check if its a gradient class
    const isGradient = color.startsWith('from-');

    if(isGradient){
        return(
            <div className={`w-4 h-4 rounded bg-linear-to-br ${color}`}></div>
        );
    }else if (type === 'class'){
        return (
            <div className="w-4 h-4 rounded border-2" style={{backgroundColor: color, borderColor: color}}></div>
        );
    }else{
        return (
            <div className="w-4 h-4 rounded" style={{backgroundColor: color}}></div>
        );
    }
}


export default function CalendarLegend({events, viewType}: CalendarLegendProps){
    //Event categories from events
    const categories = extractCategories(events);

    if(categories.length === 0){
        return null;
    }

    return(
        <div className="flex flex-wrap gap-6 mb-5 pb-5 border-b border-[#e4e4e7]">
            {categories.map((category) =>(
                <div key={category.label} className="flex items-center gap-2">
                    {/*Color Swatch */}   
                    <ColorSwatch color={category.color} type={category.type}/>

                    {/*Label*/} 
                    <div className="text-[13px] font-medium text-[#52525B] tracking-wider">
                        {category.label}
                    </div>
                </div>
            ))}
        </div>
    );
}