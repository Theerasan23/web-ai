"use client"

import Navbar from "../navbar/page";

export default function MainIndex({ children }) {

    return (

        <main className="flex flex-col gap-3 bg-[#0e1f29] h-screen">
            <div>
                {children}
            </div>
        </main>
    );

}