'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  FileText, 
  CheckCircle,
  AlertCircle,
  Download,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

interface UploadHistory {
  id: string;
  filename: string;
  upload_date: string;
  status: 'processing' | 'completed' | 'failed';
  records_processed: number;
  records_total: number;
}

export default function IngestPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [dragActive, setDragActive] = useState(false);
  
  const mockUploadHistory: UploadHistory[] = [
    {
      id: '1',
      filename: 'bank_transactions_nov_2024.csv',
      upload_date: '2024-12-10',
      status: 'completed',
      records_processed: 245,
      records_total: 245
    },
    {
      id: '2',
      filename: 'credit_card_oct_2024.csv',
      upload_date: '2024-12-08',
      status: 'completed',
      records_processed: 189,
      records_total: 189
    },
    {
      id: '3',
      filename: 'paypal_transactions.csv',
      upload_date: '2024-12-05',
      status: 'processing',
      records_processed: 45,
      records_total: 67
    }
  ];

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files: FileList) => {
    Array.from(files).forEach(file => {
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        toast.success(`${file.name} 업로드를 시작합니다.`);
        // 실제 업로드 로직은 여기에 구현
      } else {
        toast.error('CSV 파일만 업로드 가능합니다.');
      }
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">완료</Badge>;
      case 'processing':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">처리중</Badge>;
      case 'failed':
        return <Badge variant="destructive">실패</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'processing':
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div>
          <h2 className="text-3xl font-bold text-foreground">데이터 수집</h2>
          <p className="text-muted-foreground mt-2">
            은행 거래 내역, 신용카드 명세서 등을 업로드하여 구독 서비스를 자동으로 감지하세요
          </p>
        </div>

        <Tabs defaultValue="upload" className="space-y-4">
          <TabsList>
            <TabsTrigger value="upload">파일 업로드</TabsTrigger>
            <TabsTrigger value="history">업로드 내역</TabsTrigger>
            <TabsTrigger value="templates">템플릿</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            {/* 파일 업로드 영역 */}
            <Card>
              <CardHeader>
                <CardTitle>CSV 파일 업로드</CardTitle>
                <CardDescription>
                  은행 거래 내역이나 신용카드 명세서 CSV 파일을 업로드하세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive 
                      ? 'border-primary bg-primary/5' 
                      : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium">
                      파일을 드래그하여 놓거나 클릭하여 선택하세요
                    </p>
                    <p className="text-sm text-muted-foreground">
                      CSV 파일만 지원됩니다 (최대 10MB)
                    </p>
                  </div>
                  <div className="mt-6">
                    <Button>
                      파일 선택
                    </Button>
                  </div>
                </div>

                {/* 업로드 가이드 */}
                <div className="mt-6 space-y-4">
                  <h4 className="font-medium">업로드 가이드</h4>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">지원되는 형식</h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• 은행 거래 내역 CSV</li>
                        <li>• 신용카드 명세서 CSV</li>
                        <li>• PayPal 거래 내역</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">필수 컬럼</h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• 날짜 (Date)</li>
                        <li>• 설명 (Description)</li>
                        <li>• 금액 (Amount)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>업로드 내역</CardTitle>
                <CardDescription>
                  최근 업로드한 파일들의 처리 상태를 확인하세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUploadHistory.map((upload) => (
                    <div key={upload.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(upload.status)}
                        <div>
                          <p className="font-medium">{upload.filename}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(upload.upload_date).toLocaleDateString('ko-KR')} 업로드
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {upload.records_processed} / {upload.records_total} 건
                          </p>
                          <div className="w-24 bg-muted rounded-full h-2 mt-1">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{
                                width: `${(upload.records_processed / upload.records_total) * 100}%`
                              }}
                            />
                          </div>
                        </div>
                        {getStatusBadge(upload.status)}
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>CSV 템플릿</CardTitle>
                <CardDescription>
                  각 은행별 CSV 템플릿을 다운로드하여 사용하세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    { name: '국민은행', filename: 'kb_template.csv' },
                    { name: '신한은행', filename: 'shinhan_template.csv' },
                    { name: '우리은행', filename: 'woori_template.csv' },
                    { name: '하나은행', filename: 'hana_template.csv' },
                    { name: '삼성카드', filename: 'samsung_card_template.csv' },
                    { name: '현대카드', filename: 'hyundai_card_template.csv' }
                  ].map((template) => (
                    <Card key={template.filename} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-6 w-6 text-primary" />
                          <span className="font-medium">{template.name}</span>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          다운로드
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
