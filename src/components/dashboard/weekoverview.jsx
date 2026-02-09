export default function WeekOverview(){
    return(
        <div className="relative overflow-hidden bg-white rounded-[20px] p-6 
        shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
            {/*Top Gradient Border*/}
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-[#667eea] to-[#764ba2]"></div>
                <div className="text-[13px] font-semibold uppercase tracking-[0.5px] text-[#A1A1AA] mb-2">
                    Week Overview
                </div>

                <div className="text-[42px] font-bold mb-2">
                    66%
                </div>
                <div className="text-[14px] text-[#52525B]">
                    On Track
                </div>

                {/*Progress Ring*/}
                <div className="absolute bottom-5 right-5 w-20 h-20 rounded-full flex items-center justify-center"
                style={{background: 'conic-gradient(#8b5CF6 0% 66%, #E4E4E7 66% 100%)'}}>
                    <div className="absolute w-16 h-16 rounded-full bg-white"></div>
                </div>
            </div>
    );
}