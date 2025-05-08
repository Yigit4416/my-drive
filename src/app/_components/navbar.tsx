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
  DropdownMenuContent,
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

function LongBreadcrumb({ pathSegments }: { pathSegments: string[] }) {
  const lenght = pathSegments.length;
  if (lenght > 2) {
    const visibleContent =
      pathSegments.length > 2 ? pathSegments.slice(-2) : pathSegments;
    const dropdownContent = pathSegments.slice(lenght - 2);
    return (
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1">
            <BreadcrumbEllipsis className="h-4 w-4" />
            <span className="sr-only">Toggle Menu</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {dropdownContent.map((drop) => {
              const href = "/";
              return <div></div>;
            })}
          </DropdownMenuContent>
        </DropdownMenu>
        {visibleContent.map((item, index) => {
          // Need to find out about these paths
          const href = "/" + pathSegments.slice(0, index + 1).join("/");
          return (
            <Fragment key={href}>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href={"/folder" + href}>{item}</BreadcrumbLink>
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </div>
    );
  } else {
    return (
      <div>
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
      </div>
    );
  }
}
