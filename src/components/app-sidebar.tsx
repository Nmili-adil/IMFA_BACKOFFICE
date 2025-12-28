import {
  LayoutDashboard,
  Users,
  Bed,
  CalendarCheck,
  Briefcase,
  FileText,
  CreditCard,
  Hotel,
  Minus,
  Plus,
  LogOut,
} from "lucide-react"

import { useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabase"

// import { SearchForm } from "@/components/search-form"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { ROUTES } from "@/constants/appConstants"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
      items: [
        {
          title: "Charts",
          url: "/#charts",
        },
        {
          title: "Statistics",
          url: "/#",
        },
      ],
    },
    {
      title: "Users",
      url: "#",
      icon: Users,
      items: [
        {
          title: "SuperAdmin",
          url: "#",
        },
        {
          title: "Admins",
          url: "#",
          isActive: false,
        },
        {
          title: "Managers",
          url: "#",
        },
        {
          title: "Receptionist",
          url: "#",
        }
      ],
    },
    {
      title: "Rooms",
      url: "#",
      icon: Bed,
      items: [
        {
          title:'All',
          url: ROUTES.ROOMS,
        },
        {
          title: "Occupied",
          url: "#",
        },
        {
          title: "Available",
          url: ROUTES.ROOMSAVAILABLE,
        },
        {
          title: "Maintenance",
          url: ROUTES.ROOMSMAINTENANCE,
        }, {
          title:"Create New",
          url:ROUTES.ROOMSNEW,
        }
      ],
    },
    {
      title: "Reservations",
      url: "#",
      icon: CalendarCheck,
      items: [
        {
          title: "Pending",
          url: "#",
        },
        {
          title: "Confirmed",
          url: "#",
        },
        {
          title: "Cancelled",
          url: "#",
        },
        {
          title: "Completed",
          url: "#",
        }
      ],
    },
    {
      title: "Services",
      url: "#",
      icon: Briefcase,
      items: [
        {
          title: "Contribution Guide",
          url: "#",
        },
        {
          title: "Create New",
          url: ROUTES.SERVICENEW,
        }
      ],
    },
    {
      title: "Invoices",
      url: "#",
      icon: FileText,
      items: [
        {
          title: "Pending",
          url: "#",
        }, {
          title: "Confirmed",
          url: "#",
        }, {
          title: "Cancelled",
          url: "#",
        }, {
          title: "Completed",
          url: "#",
        }
      ],
    },
    {
      title: "Payments",
      url: "#",
      icon: CreditCard,
      items: [
        {
          title: "Pending",
          url: "#",
        }, 
        {
          title: "Confirmed",
          url: "#",
        }, {
          title: "Cancelled",
          url: "#",
        }, {
          title: "Completed",
          url: "#",
        }
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/login")
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Hotel className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
                  <span className="font-medium">Hotel</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {/* <div className="group-data-[collapsible=icon]:hidden">
          <SearchForm />
        </div> */}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item, index) => (
              <Collapsible
                key={item.title}
                defaultOpen={index === 1}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon className="size-4" />}
                      <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                      <Plus className="ml-auto group-data-[state=open]/collapsible:hidden group-data-[collapsible=icon]:hidden" />
                      <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden group-data-[collapsible=icon]:hidden" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {item.items?.length ? (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={subItem.isActive ? true : false}
                            >
                              <a href={subItem.url}>
                                <span>{subItem.title}</span>
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 group-data-[collapsible=icon]:!p-2"
              tooltip="Log out"
            >
              <LogOut className="size-4" />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
