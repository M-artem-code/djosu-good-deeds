# Smoke: Deeds + Friends (users A=alice*, B=bob*, C=carol*)
$base = "http://localhost:3001/api"
$ts = [guid]::NewGuid().ToString("N").Substring(0, 6)
$aliceTag = "alice_$ts"
$bobTag = "bob_$ts"
$carolTag = "carol_$ts"

function Register-User($tag, $name) {
  $body = @{
    email = "$tag@example.com"
    password = "secret12"
    displayName = $name
    tag = $tag
  } | ConvertTo-Json
  return Invoke-RestMethod -Uri "$base/auth/register" -Method POST -Body $body -ContentType "application/json"
}

function Auth($token) { @{ Authorization = "Bearer $token" } }

function Assert-HttpCode($expected, $raw) {
  if ($raw.Length -lt 3) { throw "Invalid curl output: $raw" }
  $code = $raw.Substring($raw.Length - 3)
  if ($code -ne $expected) {
    throw "Expected HTTP $expected, got $code (output: $raw)"
  }
}

Write-Host "=== Deeds + Friends Smoke ===" -ForegroundColor Cyan

$A = Register-User $aliceTag "Alice"
$B = Register-User $bobTag "Bob"
$C = Register-User $carolTag "Carol"
$hA = Auth $A.accessToken
$hB = Auth $B.accessToken
$hC = Auth $C.accessToken

Write-Host "[1] A: POST deed"
$deed = Invoke-RestMethod -Uri "$base/deeds" -Method POST -Headers $hA -Body (@{ title = "Help neighbor" } | ConvertTo-Json) -ContentType "application/json"
Write-Host "    OK id=$($deed._id)" -ForegroundColor Green

Write-Host "[2] A: GET deeds"
$list = Invoke-RestMethod -Uri "$base/deeds" -Headers $hA
if ($list.Count -ne 1) { throw "Expected 1 deed" }
Write-Host "    OK count=1" -ForegroundColor Green

Write-Host "[3] A: PATCH deed done"
$patched = Invoke-RestMethod -Uri "$base/deeds/$($deed._id)" -Method PATCH -Headers $hA -Body (@{ status = "done" } | ConvertTo-Json) -ContentType "application/json"
if ($patched.status -ne "done") { throw "Status not done" }
Write-Host "    OK status=done" -ForegroundColor Green

Write-Host "[4] B: POST friend alice"
$friend = Invoke-RestMethod -Uri "$base/friends" -Method POST -Headers $hB -Body (@{ tag = $aliceTag } | ConvertTo-Json) -ContentType "application/json"
Write-Host "    OK friendship=$($friend._id)" -ForegroundColor Green

Write-Host "[5] B: GET friends"
$friends = Invoke-RestMethod -Uri "$base/friends" -Headers $hB
if ($friends.Count -lt 1 -or $friends[0].friend.tag -ne $aliceTag) { throw "Alice not in friends" }
Write-Host "    OK alice listed" -ForegroundColor Green

Write-Host "[6] B: GET friends/$aliceTag/deeds"
$friendDeeds = Invoke-RestMethod -Uri "$base/friends/$aliceTag/deeds" -Headers $hB
if ($friendDeeds.Count -lt 1) { throw "No friend deeds" }
Write-Host "    OK sees $($friendDeeds.Count) deed(s)" -ForegroundColor Green

Write-Host "[7] C: GET friends/$aliceTag/deeds (expect 403)"
try {
  Invoke-RestMethod -Uri "$base/friends/$aliceTag/deeds" -Headers $hC
  throw "Should be 403"
} catch {
  if ($_.Exception.Response.StatusCode.value__ -eq 403) {
    Write-Host "    OK 403" -ForegroundColor Green
  } else { throw }
}

Write-Host "[8] B: DELETE friendship (expect 204)"
$delFriendOut = curl.exe -s -w "%{http_code}" -X DELETE -H "Authorization: Bearer $($B.accessToken)" "$base/friends/$($friend._id)"
Assert-HttpCode "204" $delFriendOut
Write-Host "    OK 204" -ForegroundColor Green

Write-Host "[9] B: GET friend deeds (expect 403)"
try {
  Invoke-RestMethod -Uri "$base/friends/$aliceTag/deeds" -Headers $hB
  throw "Should be 403"
} catch {
  if ($_.Exception.Response.StatusCode.value__ -eq 403) {
    Write-Host "    OK 403" -ForegroundColor Green
  } else { throw }
}

Write-Host "[10] A: DELETE deed (expect 204)"
$delDeedOut = curl.exe -s -w "%{http_code}" -X DELETE -H "Authorization: Bearer $($A.accessToken)" "$base/deeds/$($deed._id)"
Assert-HttpCode "204" $delDeedOut
Write-Host "    OK 204" -ForegroundColor Green

Write-Host "[11] A: DELETE account (expect 204)"
$delAccountOut = curl.exe -s -w "%{http_code}" -X DELETE -H "Authorization: Bearer $($A.accessToken)" "$base/users/me"
Assert-HttpCode "204" $delAccountOut
Write-Host "    OK cascade delete" -ForegroundColor Green

Write-Host "`n=== All Deeds+Friends checks passed ===" -ForegroundColor Cyan
