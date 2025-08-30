import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-6xl font-bold gradient-text mb-4">404</CardTitle>
          <CardTitle className="text-2xl">페이지를 찾을 수 없습니다</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            요청하신 페이지가 존재하지 않거나 이동되었습니다.
          </p>
          <Button 
            onClick={() => window.location.href = '/'}
            className="w-full"
          >
            <Home className="mr-2 h-4 w-4" />
            홈으로 돌아가기
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
