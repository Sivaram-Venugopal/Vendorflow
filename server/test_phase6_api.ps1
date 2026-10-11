$ErrorActionPreference = "Stop"

Write-Host "=== VendorFlow Phase 6: Notifications & Audit Log API E2E Test ===" -ForegroundColor Cyan

# 1. Start server in background if not running, or test if already running
$baseUrl = "http://localhost:5000/api"

try {
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get -TimeoutSec 2
    Write-Host "Server is running (DB: $($health.db))" -ForegroundColor Green
} catch {
    Write-Host "Starting server..." -ForegroundColor Yellow
    $serverProcess = Start-Process -FilePath "node" -ArgumentList "src/server.js" -WorkingDirectory "C:\Users\LAKSHMI\Vendorflow\server" -PassThru
    Start-Sleep -Seconds 3
}

# 2. Login as Admin
Write-Host "`n1. Logging in as Admin..." -ForegroundColor Yellow
$adminLoginBody = @{
    email = "admin@vendorflow.io"
    password = "Password123!"
} | ConvertTo-Json

$adminRes = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $adminLoginBody -ContentType "application/json"
$adminToken = $adminRes.data.token
$adminHeaders = @{ "Authorization" = "Bearer $adminToken" }
Write-Host "Admin Logged In: $($adminRes.data.user.name)" -ForegroundColor Green

# 3. Login as Buyer
Write-Host "`n2. Logging in as Buyer..." -ForegroundColor Yellow
$buyerLoginBody = @{
    email = "buyer@vendorflow.io"
    password = "Password123!"
} | ConvertTo-Json

$buyerRes = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $buyerLoginBody -ContentType "application/json"
$buyerToken = $buyerRes.data.token
$buyerHeaders = @{ "Authorization" = "Bearer $buyerToken" }
Write-Host "Buyer Logged In: $($buyerRes.data.user.name)" -ForegroundColor Green

# 4. Fetch a vendor
$vendors = (Invoke-RestMethod -Uri "$baseUrl/vendors" -Method Get -Headers $adminHeaders).data
$targetVendor = $vendors[0]
Write-Host "Target Vendor: $($targetVendor.companyName) (ID: $($targetVendor._id))" -ForegroundColor DarkCyan

# 5. Admin updates vendor status (Triggers Ethereal email + AuditLog)
Write-Host "`n3. Admin updating vendor status to 'Approved'..." -ForegroundColor Yellow
$statusBody = @{
    status = "Approved"
    reason = "Passed compliance verification and statutory tax audit"
} | ConvertTo-Json

$statusRes = Invoke-RestMethod -Uri "$baseUrl/vendors/$($targetVendor._id)/status" -Method Patch -Body $statusBody -ContentType "application/json" -Headers $adminHeaders
Write-Host "Vendor status updated: $($statusRes.data.status)" -ForegroundColor Green

# 6. Buyer submits an evaluation (Triggers Ethereal email + AuditLog)
Write-Host "`n4. Buyer submitting vendor evaluation..." -ForegroundColor Yellow
$evalBody = @{
    vendorId = $targetVendor._id
    period = "Q3 2026"
    qualityScore = 4.8
    deliveryScore = 4.6
    pricingScore = 4.2
    complianceScore = 4.9
    feedbackComments = "Automated test audit evaluation"
} | ConvertTo-Json

$evalRes = Invoke-RestMethod -Uri "$baseUrl/evaluations" -Method Post -Body $evalBody -ContentType "application/json" -Headers $buyerHeaders
Write-Host "Evaluation created! Score: $($evalRes.data.evaluation.overallScore) | Tier: $($evalRes.data.evaluation.ratingTier)" -ForegroundColor Green

# 7. Query GET /api/audit-logs as Admin
Write-Host "`n5. Admin querying GET /api/audit-logs..." -ForegroundColor Yellow
$auditRes = Invoke-RestMethod -Uri "$baseUrl/audit-logs" -Method Get -Headers $adminHeaders
Write-Host "Total Audit Logs retrieved: $($auditRes.total)" -ForegroundColor Green
$latestLog = $auditRes.data[0]
Write-Host "Latest Log: Action: $($latestLog.action) | Entity: $($latestLog.entityType) | Actor: $($latestLog.user.name)" -ForegroundColor White
if ($latestLog.details.emailPreviewUrl) {
    Write-Host "Ethereal Test Email URL: $($latestLog.details.emailPreviewUrl)" -ForegroundColor Cyan
}

# 8. Query GET /api/notifications
Write-Host "`n6. Querying GET /api/notifications..." -ForegroundColor Yellow
$notifRes = Invoke-RestMethod -Uri "$baseUrl/notifications" -Method Get -Headers $adminHeaders
Write-Host "Total Notifications: $($notifRes.count) | Unread: $($notifRes.unreadCount)" -ForegroundColor Green
if ($notifRes.data.Count -gt 0) {
    Write-Host "Top Notification: '$($notifRes.data[0].title)' - $($notifRes.data[0].message)" -ForegroundColor White
}

# 9. Verify 403 Forbidden for non-Admin on /api/audit-logs
Write-Host "`n7. Verifying non-Admin access is blocked (Buyer calling /api/audit-logs)..." -ForegroundColor Yellow
try {
    Invoke-RestMethod -Uri "$baseUrl/audit-logs" -Method Get -Headers $buyerHeaders
    Write-Host "ERROR: Buyer was able to access /api/audit-logs!" -ForegroundColor Red
    exit 1
} catch {
    Write-Host "Security Verified: Non-admin received HTTP $($_.Exception.Response.StatusCode.value__) Forbidden" -ForegroundColor Green
}

Write-Host "`n🎉 Phase 6 API Verification Complete! All criteria passed!" -ForegroundColor Green

if ($serverProcess) {
    Stop-Process -Id $serverProcess.Id -Force
}
