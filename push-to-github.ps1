# Script PowerShell pour push le projet sur GitHub
# Usage: .\push-to-github.ps1

Write-Host "Configuration Git pour GitHub" -ForegroundColor Cyan
Write-Host ""

# Demander l'URL du repository GitHub
$githubUrl = Read-Host "Entrez l'URL de votre repository GitHub (ex: https://github.com/VOTRE_USERNAME/VRS2.git)"

if ([string]::IsNullOrWhiteSpace($githubUrl)) {
    Write-Host "URL invalide. Annulation." -ForegroundColor Red
    exit 1
}

# Vérifier si le remote existe déjà
try {
    $existingRemote = git remote get-url origin 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Un remote 'origin' existe deja: $existingRemote" -ForegroundColor Yellow
        $replace = Read-Host "Voulez-vous le remplacer? (o/n)"
        if ($replace -eq "o" -or $replace -eq "O") {
            git remote remove origin
            Write-Host "Remote existant supprime" -ForegroundColor Green
        } else {
            Write-Host "Annulation." -ForegroundColor Yellow
            exit 0
        }
    }
} catch {
    # Pas de remote, continuer
}

# Ajouter le remote
Write-Host ""
Write-Host "Ajout du remote GitHub..." -ForegroundColor Cyan
git remote add origin $githubUrl

if ($LASTEXITCODE -ne 0) {
    Write-Host "Erreur lors de l'ajout du remote" -ForegroundColor Red
    exit 1
}

Write-Host "Remote ajoute avec succes" -ForegroundColor Green

# Changer le nom de la branche à main
Write-Host ""
Write-Host "Changement du nom de branche a 'main'..." -ForegroundColor Cyan
git branch -M main

# Afficher les commandes pour push
Write-Host ""
Write-Host "Configuration terminee!" -ForegroundColor Green
Write-Host ""
Write-Host "Pour push votre code sur GitHub, executez:" -ForegroundColor Yellow
Write-Host "   git push -u origin main" -ForegroundColor White
Write-Host ""
Write-Host "Si GitHub vous demande des identifiants:" -ForegroundColor Yellow
Write-Host "   - Utilisez votre nom d'utilisateur GitHub" -ForegroundColor White
Write-Host "   - Pour le mot de passe, utilisez un Personal Access Token" -ForegroundColor White
Write-Host "   - Creez un token ici: https://github.com/settings/tokens" -ForegroundColor White
Write-Host ""

$pushNow = Read-Host "Voulez-vous push maintenant? (o/n)"
if ($pushNow -eq "o" -or $pushNow -eq "O") {
    Write-Host ""
    Write-Host "Push en cours..." -ForegroundColor Cyan
    git push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "Push reussi!" -ForegroundColor Green
        Write-Host "Votre code est maintenant sur GitHub!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "Erreur lors du push" -ForegroundColor Red
        Write-Host "Verifiez vos identifiants GitHub et reessayez." -ForegroundColor Yellow
    }
}