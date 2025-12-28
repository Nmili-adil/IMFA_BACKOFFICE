import { Outlet, Link } from "react-router-dom"
import PersonalisedSidebar from "./partials/personalised-sidebar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"

const Layout = () => {
  return (
    <PersonalisedSidebar>
      <header className="flex h-16 shrink-0 items-center justify-between border-b px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1 md:hidden" />
          <Separator orientation="vertical" className="mr-2 h-4 md:hidden" />
          <div className="flex items-center gap-2">
            <span className="font-semibold">IMFA Backoffice</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button variant="ghost" size="icon" asChild>
            <Link to="/profile">
              <User className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Profile</span>
            </Link>
          </Button>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <Outlet />
      </div>
    </PersonalisedSidebar>
  )
}

export default Layout