"use client";

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";

import { usePathname } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { Slash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export function NavBar() {
  const pathname = usePathname();
  const [pathSegments, setPathSegments] = useState<string[]>([]);

  // Only update path segments after initial render to ensure client/server match
  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);
    const relevantPart = segments.slice(1).join("/");
    setPathSegments(relevantPart.split("/").filter(Boolean));
  }, [pathname]);

  return (
    <div className="mt-0.5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          {pathSegments.map((segment, index) => {
            const href = "/" + pathSegments.slice(0, index + 1).join("/");
            return (
              <Fragment key={href}>
                <BreadcrumbSeparator>
                  <Slash />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink href={"/folder" + href}>
                    {segment}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}

function LongBreadcrumb(pathSegments: string[]) {
  const lenght = pathSegments.length;
  pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");
    if (index !== lenght - 2) {
      <DropdownMenu>
        <DropdownMenuTrigger>
          <BreadcrumbEllipsis className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuItem>{segment}</DropdownMenuItem>
      </DropdownMenu>;
    }
  });
}
