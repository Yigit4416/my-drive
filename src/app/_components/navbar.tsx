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
import Link from "next/link";

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
          <LongBreadcrumb pathSegments={pathSegments} />
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
    const dropdownContent = pathSegments.slice(0, lenght - 2);
    const dropdownLength = dropdownContent.length;
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center space-x-1">
            <BreadcrumbEllipsis className="h-4 w-4 text-gray-500" />
            <span className="sr-only">Toggle Menu</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="rounded-md bg-white p-2 shadow-md">
            {dropdownContent.map((drop, index) => {
              const href = "/" + pathSegments.slice(0, index + 1).join("/");
              return (
                <Link href={"/folder" + href} prefetch={true}>
                  <DropdownMenuItem
                    key={href}
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    {drop}
                  </DropdownMenuItem>
                </Link>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
        {visibleContent.map((item, index) => {
          const href =
            "/folder/" +
            pathSegments.slice(0, index + dropdownLength).join("/");
          return (
            <Fragment key={href}>
              <BreadcrumbSeparator className="text-gray-400">
                <Slash />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href={href}>{item}</BreadcrumbLink>
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </>
    );
  } else {
    return (
      <>
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
      </>
    );
  }
}
