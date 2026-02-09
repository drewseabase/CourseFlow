import Navbar from "@/components/navbar";

export default function DashboardLayout({
    children,
}:{
    children: React.ReactNode;
}) {
    return(
        <>
        {/*Main Content*/}
        <div className="max-w-375 mx-auto px-10 py-10">
            <Navbar/>
            <main className="mt-8">{children}</main>
        </div>
        </>
    );
}