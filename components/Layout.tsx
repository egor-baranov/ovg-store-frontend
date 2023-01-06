import clsx from "clsx"
import React, { ReactNode } from "react"
import { HeaderSpacer } from "./HeaderLayout"

export const MainLayout: React.FC<{ children: ReactNode; className?: string }> = ({ children, className }) => {
    return (
        <main className={clsx("max-w-2xl mx-auto pt-4 px-4 min-h-screen", className)}>
            <HeaderSpacer />
            {children}
        </main>
    )
}
export const MainLayoutNoMargin: React.FC<{ children: ReactNode; className?: string }> = ({ children, className }) => {
    return (
        <main className={clsx("max-2w-xl mx-auto pt-4 min-h-screen", className)}>
            <HeaderSpacer />
            {children}
        </main>
    )
}