import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminUsersPage() {
  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Manage Users</h1>
        <p className="text-muted-foreground">Control user roles and access permissions.</p>
      </div>
       <Card>
        <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>This feature is not yet implemented.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col items-center justify-center gap-4 text-center border-2 border-dashed border-muted rounded-lg p-12">
                <h3 className="text-xl font-semibold">Coming Soon</h3>
                <p className="text-muted-foreground max-w-md">The ability to manage user roles and permissions from this dashboard will be available in a future update.</p>
                <Button disabled>Invite New User</Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
