"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";

import { usePathname } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import Link from "next/link";

export function NavBar() {
  const pathname = usePathname();
  const [pathSegments, setPathSegments] = useState<string[]>([]);

  // Only update path segments after initial render to ensure client/server match
  useEffect(() => {
    setPathSegments(pathname.split("/").filter((segment) => segment));
  }, [pathname]);

  return (
    <div className="mt-0.5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/" passHref legacyBehavior>
              <BreadcrumbLink>Home</BreadcrumbLink>
            </Link>
          </BreadcrumbItem>

          {pathSegments.map((segment, index) => {
            const href = "/" + pathSegments.slice(0, index + 1).join("/");
            return (
              <Fragment key={href}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <Link href={href} passHref legacyBehavior>
                    <BreadcrumbLink>{segment}</BreadcrumbLink>
                  </Link>
                </BreadcrumbItem>
              </Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
