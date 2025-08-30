import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { QuickAddModal } from '@/components/ui/quick-add-modal';
import { DetailedAddForm } from '@/components/ui/detailed-add-form';
import { 
  Upload, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Download,
  Plus,
  Zap,
  Edit,
  Clock,
  TrendingUp
} from 'lucide-react';

const Ingest = () => {
  const { toast } = useToast();
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResults, setUploadResults] = useState<any>(null);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [showDetailedForm, setShowDetailedForm] = useState(false);
  const [activeTab, setActiveTab] = useState('quick');

  const handleFileUpload = async () => {
    setUploadStatus('uploading');
    setUploadProgress(0);

    // Simulate file upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadStatus('success');
          
          // Mock upload results
          const mockUploadResults = {
            totalRows: 25,
            successfulRows: 22,
            failedRows: 3,
            errors: [
              { row: 5, reason: '잘못된 날짜 형식' },
              { row: 12, reason: '필수 필드 누락: 서비스명' },
              { row: 18, reason: '유효하지 않은 금액' }
            ]
          };
          
          setUploadResults(mockUploadResults);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleQuickAddSuccess = () => {
    // Refresh data or update UI as needed
    toast({
      title: "구독이 추가되었습니다",
      description: "새로운 구독이 성공적으로 등록되었습니다."
    });
  };

  const handleDetailedFormSuccess = () => {
    setShowDetailedForm(false);
    toast({
      title: "구독이 추가되었습니다", 
      description: "상세 정보와 함께 구독이 등록되었습니다."
    });
  };

  const handleDetailedFormCancel = () => {
    setShowDetailedForm(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-text">데이터 관리</h1>
        <p className="text-muted-foreground">구독 데이터를 업로드하거나 직접 등록하세요</p>
      </div>

      {/* 빠른 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">이번 달 추가</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">처리 대기</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <Clock className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">총 구독</p>
                <p className="text-2xl font-bold">47</p>
              </div>
              <FileText className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="quick">빠른 등록</TabsTrigger>
          <TabsTrigger value="detailed">상세 등록</TabsTrigger>
          <TabsTrigger value="upload">파일 업로드</TabsTrigger>
        </TabsList>

        {/* 빠른 등록 탭 */}
        <TabsContent value="quick" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                빠른 구독 등록
              </CardTitle>
              <CardDescription>
                필수 정보만 입력하여 10-20초 내에 구독을 추가하세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium">빠른 등록 장점</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      10-20초 내 완료
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      자동완성 지원
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      중복 감지
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      평균 요금 자동 입력
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">필수 입력 정보</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• 서비스명 (자동완성)</li>
                    <li>• 월 결제 금액</li>
                    <li>• 결제 주기</li>
                  </ul>
                  <p className="text-xs text-muted-foreground">
                    선택사항: 다음 결제일, 메모
                  </p>
                </div>
              </div>
              
              <Button 
                onClick={() => setQuickAddOpen(true)}
                className="w-full"
                size="lg"
              >
                <Plus className="mr-2 h-4 w-4" />
                빠른 구독 추가
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 상세 등록 탭 */}
        <TabsContent value="detailed" className="space-y-6">
          {!showDetailedForm ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit className="h-5 w-5" />
                  상세 구독 등록
                </CardTitle>
                <CardDescription>
                  모든 구독 정보를 자세히 입력하여 완전한 관리를 시작하세요
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-medium">상세 등록 장점</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        완전한 구독 정보 관리
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        태그 및 카테고리 설정
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        결제 수단 및 좌석 수 관리
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        해지 URL 및 메모 저장
                      </li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">추가 입력 정보</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• 플랜명 및 카테고리</li>
                      <li>• 결제 수단 및 좌석 수</li>
                      <li>• 웹사이트 및 해지 URL</li>
                      <li>• 태그 및 상세 메모</li>
                    </ul>
                  </div>
                </div>
                
                <Button 
                  onClick={() => setShowDetailedForm(true)}
                  className="w-full"
                  size="lg"
                  variant="outline"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  상세 등록 시작
                </Button>
              </CardContent>
            </Card>
          ) : (
            <DetailedAddForm 
              onSuccess={handleDetailedFormSuccess}
              onCancel={handleDetailedFormCancel}
            />
          )}
        </TabsContent>

        {/* 파일 업로드 탭 */}
        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                CSV 파일 업로드
              </CardTitle>
              <CardDescription>
                대량의 구독 데이터를 CSV 파일로 한 번에 업로드하세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 파일 업로드 영역 */}
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">CSV 파일을 드래그하거나 클릭하여 선택하세요</p>
                  <p className="text-sm text-muted-foreground">
                    최대 10MB까지 지원 • .csv 파일만 업로드 가능
                  </p>
                </div>
                <Button className="mt-4" onClick={handleFileUpload}>
                  파일 선택
                </Button>
              </div>

              {/* CSV 템플릿 다운로드 */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">CSV 템플릿 다운로드</p>
                    <p className="text-sm text-muted-foreground">올바른 형식의 샘플 파일을 다운로드하세요</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  템플릿 다운로드
                </Button>
              </div>

              {/* 업로드 진행 상태 */}
              {uploadStatus === 'uploading' && (
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">업로드 진행 중...</span>
                        <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 업로드 결과 */}
              {uploadResults && uploadStatus === 'success' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-success">
                      <CheckCircle className="h-5 w-5" />
                      업로드 완료
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-success">{uploadResults.successfulRows}</p>
                        <p className="text-sm text-muted-foreground">성공</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-destructive">{uploadResults.failedRows}</p>
                        <p className="text-sm text-muted-foreground">실패</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{uploadResults.totalRows}</p>
                        <p className="text-sm text-muted-foreground">총 행</p>
                      </div>
                    </div>
                    
                    {uploadResults.errors && uploadResults.errors.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-destructive" />
                          오류 상세
                        </h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {uploadResults.errors.map((error: any, index: number) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <Badge variant="destructive" className="text-xs">
                                행 {error.row}
                              </Badge>
                              <span className="text-muted-foreground">{error.reason}</span>
                            </div>
                          ))}
                        </div>
                        <Button variant="outline" size="sm" className="mt-3">
                          <Download className="mr-2 h-4 w-4" />
                          오류 리포트 다운로드
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* 업로드 가이드 */}
              <Card>
                <CardHeader>
                  <CardTitle>업로드 가이드</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">필수 컬럼</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• service_name (서비스명)</li>
                        <li>• amount (결제 금액)</li>
                        <li>• billing_cycle (결제 주기)</li>
                        <li>• next_billing (다음 결제일)</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">선택 컬럼</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• category (카테고리)</li>
                        <li>• plan_name (플랜명)</li>
                        <li>• description (설명)</li>
                        <li>• tags (태그)</li>
                      </ul>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <p className="text-sm">
                      <strong>💡 팁:</strong> 템플릿을 다운로드하여 정확한 형식을 확인하세요. 
                      잘못된 형식의 데이터는 자동으로 감지되어 오류 리포트에 포함됩니다.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Add Modal */}
      <QuickAddModal 
        open={quickAddOpen}
        onOpenChange={setQuickAddOpen}
        onSuccess={handleQuickAddSuccess}
      />
    </div>
  );
};

export default Ingest;