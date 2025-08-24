#!/bin/bash

# SubscriptionMaster 개발 환경 설정 스크립트
# 실행 권한: chmod +x scripts/setup-dev.sh

set -e

echo "🚀 SubscriptionMaster 개발 환경 설정을 시작합니다..."

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 로그 함수
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Node.js 버전 확인
check_node_version() {
    log_info "Node.js 버전을 확인합니다..."
    
    if ! command -v node &> /dev/null; then
        log_error "Node.js가 설치되어 있지 않습니다. Node.js 18+ 버전을 설치해주세요."
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2)
    REQUIRED_VERSION="18.0.0"
    
    if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
        log_error "Node.js 18+ 버전이 필요합니다. 현재 버전: $NODE_VERSION"
        exit 1
    fi
    
    log_success "Node.js 버전 확인 완료: $NODE_VERSION"
}

# Docker 확인
check_docker() {
    log_info "Docker 설치 상태를 확인합니다..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker가 설치되어 있지 않습니다. Docker를 설치해주세요."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose가 설치되어 있지 않습니다. Docker Compose를 설치해주세요."
        exit 1
    fi
    
    log_success "Docker 및 Docker Compose 확인 완료"
}

# 의존성 설치
install_dependencies() {
    log_info "프로젝트 의존성을 설치합니다..."
    
    # 루트 의존성 설치
    npm install
    
    # 백엔드 의존성 설치
    if [ -d "backend" ]; then
        log_info "백엔드 의존성을 설치합니다..."
        cd backend && npm install && cd ..
    fi
    
    # 프론트엔드 의존성 설치
    if [ -d "frontend" ]; then
        log_info "프론트엔드 의존성을 설치합니다..."
        cd frontend && npm install && cd ..
    fi
    
    log_success "의존성 설치 완료"
}

# 환경 변수 파일 생성
setup_env() {
    log_info "환경 변수 파일을 설정합니다..."
    
    if [ ! -f ".env" ]; then
        if [ -f "env.example" ]; then
            cp env.example .env
            log_success ".env 파일이 생성되었습니다. 필요에 따라 값을 수정해주세요."
        else
            log_warning "env.example 파일을 찾을 수 없습니다."
        fi
    else
        log_info ".env 파일이 이미 존재합니다."
    fi
}

# 데이터베이스 시작
start_database() {
    log_info "개발 데이터베이스를 시작합니다..."
    
    # 기존 컨테이너 중지
    docker-compose -f docker-compose.dev.yml down 2>/dev/null || true
    
    # 데이터베이스 시작
    docker-compose -f docker-compose.dev.yml up -d postgres redis minio
    
    # 데이터베이스 준비 대기
    log_info "데이터베이스가 준비될 때까지 대기합니다..."
    sleep 10
    
    # 헬스체크
    if docker-compose -f docker-compose.dev.yml exec -T postgres pg_isready -U postgres -d subscriptionmaster > /dev/null 2>&1; then
        log_success "PostgreSQL 데이터베이스가 준비되었습니다."
    else
        log_error "PostgreSQL 데이터베이스 연결에 실패했습니다."
        exit 1
    fi
    
    if docker-compose -f docker-compose.dev.yml exec -T redis redis-cli ping > /dev/null 2>&1; then
        log_success "Redis가 준비되었습니다."
    else
        log_error "Redis 연결에 실패했습니다."
        exit 1
    fi
}

# 데이터베이스 스키마 적용
apply_schema() {
    log_info "데이터베이스 스키마를 적용합니다..."
    
    if [ -f "db/schema.sql" ]; then
        docker-compose -f docker-compose.dev.yml exec -T postgres psql -U postgres -d subscriptionmaster -f /docker-entrypoint-initdb.d/schema.sql
        log_success "데이터베이스 스키마가 적용되었습니다."
    else
        log_warning "db/schema.sql 파일을 찾을 수 없습니다."
    fi
}

# 개발 서버 시작 안내
show_next_steps() {
    echo ""
    log_success "🎉 개발 환경 설정이 완료되었습니다!"
    echo ""
    echo "다음 단계:"
    echo "1. 백엔드 개발 서버 시작: ${BLUE}npm run dev:backend${NC}"
    echo "2. 프론트엔드 개발 서버 시작: ${BLUE}npm run dev:frontend${NC}"
    echo "3. 전체 개발 서버 시작: ${BLUE}npm run dev${NC}"
    echo ""
    echo "데이터베이스 관리:"
    echo "- 데이터베이스 중지: ${BLUE}npm run docker:down${NC}"
    echo "- 데이터베이스 재시작: ${BLUE}npm run docker:dev${NC}"
    echo ""
    echo "테스트 실행:"
    echo "- 전체 테스트: ${BLUE}npm test${NC}"
    echo "- 백엔드 테스트: ${BLUE}npm run test:backend${NC}"
    echo "- 프론트엔드 테스트: ${BLUE}npm run test:frontend${NC}"
}

# 메인 실행
main() {
    echo "=========================================="
    echo "  SubscriptionMaster 개발 환경 설정"
    echo "=========================================="
    echo ""
    
    check_node_version
    check_docker
    install_dependencies
    setup_env
    start_database
    apply_schema
    show_next_steps
}

# 스크립트 실행
main "$@"
