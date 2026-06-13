git add "src/app/onboarding.tsx"
git commit -m "feat: enhance onboarding screen with native floating UI graphics and skip logic"

git add "src/app/(app)/(settings)/settings.tsx" "src/app/(auth)/sign-in.tsx" "src/store/index.ts"
git commit -m "fix: resolve logout routing bug and correct persistent session behavior"

git push origin Dev
git checkout main
git merge Dev
git push origin main
git checkout Dev
