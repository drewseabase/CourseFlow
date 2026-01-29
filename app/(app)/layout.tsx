import Link from "next/link";

const nav = [
    {href: "/calendar", label: "Calendar"},
    {href: "/today", label: "Today"},
    {href: "/settings", label: "Settings"},
];

export default function AppLayout({children}: {children: React.ReactNode}){
    return(
        <div className="min-h-screen">
            <header className="border-b">
                <nav className="mx-auto flex max-w-5xl items-center gap-6 p-4">
                    <span className="font-semibold">CourseFlow</span>
                    <div className="flex gap-4">
                        {nav.map((item)=> (
                            <Link key={item.href} href={item.href} className="hover:underline">
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </nav>
            </header>

            <main className="mx-auto max-w-5xl p-4">{children}</main>
        </div>
    )
}