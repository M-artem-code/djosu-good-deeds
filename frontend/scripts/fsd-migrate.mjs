/**
 * One-shot FSD migration: copy src files to new layer paths and rewrite imports.
 * Run: node scripts/fsd-migrate.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, "../src");

const REPLACEMENTS = [
  [/@\/components\/ui\/Loader/g, "@/shared/ui/loader"],
  [/@\/components\/ui\/PrimaryButton/g, "@/shared/ui/primary-button"],
  [/@\/components\/ui\/TextField/g, "@/shared/ui/text-field"],
  [/@\/components\/ui\/TextButton/g, "@/shared/ui/text-button"],
  [/@\/components\/ui\/TextAreaField/g, "@/shared/ui/text-area-field"],
  [/@\/components\/ui\/DeedSkeletonCard/g, "@/shared/ui/deed-skeleton-card"],
  [/@\/components\/ui\/FriendSkeletonCard/g, "@/shared/ui/friend-skeleton-card"],
  [/@\/components\/ui\/ProfileSkeletonCard/g, "@/shared/ui/profile-skeleton-card"],
  [/@\/components\/feedback\/ErrorBanner/g, "@/shared/ui/error-banner"],
  [/@\/components\/patterns\/EmptyState/g, "@/shared/ui/empty-state"],
  [/@\/components\/patterns\/ConfirmDialog/g, "@/shared/ui/confirm-dialog"],
  [/@\/components\/patterns\/FormErrorBanner/g, "@/shared/ui/form-error-banner"],
  [/@\/components\/patterns\/PageShell/g, "@/widgets/page-shell"],
  [/@\/components\/patterns\/PageHeader/g, "@/widgets/page-header"],
  [/@\/components\/patterns\/ListQueryState/g, "@/widgets/list-query-state"],
  [/@\/components\/layout\/AppNav/g, "@/widgets/app-nav"],
  [/@\/components\/providers\/StoreProvider/g, "@/shared/api/store-provider"],
  [/@\/components\/deeds\/AddDeedForm/g, "@/features/deed/create"],
  [/@\/components\/deeds\/DeleteDeedModal/g, "@/features/deed/delete"],
  [/@\/components\/deeds\/DeedCard/g, "@/entities/deed"],
  [/@\/components\/deeds\/DeedList/g, "@/entities/deed"],
  [/@\/components\/deeds\/StatusBadge/g, "@/entities/deed"],
  [/@\/components\/friends\/AddFriendForm/g, "@/features/friend/add"],
  [/@\/components\/friends\/RemoveFriendModal/g, "@/features/friend/remove"],
  [/@\/components\/friends\/FriendCard/g, "@/entities/friend"],
  [/@\/components\/friends\/FriendsList/g, "@/entities/friend"],
  [/@\/components\/friends\/FriendDeedList/g, "@/entities/friend"],
  [/@\/components\/friends\/FriendDeedsHeader/g, "@/entities/friend"],
  [/@\/components\/friends\/ForbiddenDeedsView/g, "@/entities/friend"],
  [/@\/components\/friends\/BackToFriendsLink/g, "@/entities/friend"],
  [/@\/components\/settings\/ProfileSettingsCard/g, "@/features/profile/update"],
  [/@\/components\/settings\/DeleteAccountModal/g, "@/features/account/delete"],
  [/@\/components\/auth\/LoginForm/g, "@/features/auth/login"],
  [/@\/components\/auth\/RegisterForm/g, "@/features/auth/register"],
  [/@\/components\/auth\/LogoutConfirmModal/g, "@/features/auth/logout"],
  [/@\/components\/auth\/AuthReasonBanners/g, "@/features/auth/session-banners"],
  [/@\/components\/auth\/AuthFormErrorBanner/g, "@/features/auth/session-banners"],
  [/@\/components\/auth\/AuthGuard/g, "@/features/auth/guard"],
  [/@\/components\/auth\/GuestAuthGuard/g, "@/features/auth/guard"],
  [/@\/components\/auth\/AuthPageLayout/g, "@/features/auth/layout"],
  [/@\/components\/auth\/AuthCard/g, "@/features/auth/layout"],
  [/@\/hooks\/deeds\/useAddDeedForm/g, "@/features/deed/create"],
  [/@\/hooks\/deeds\/useDeedEditForm/g, "@/features/deed/edit"],
  [/@\/hooks\/deeds\/useDeedMarkStatus/g, "@/features/deed/mark-status"],
  [/@\/hooks\/deeds\/useDeedListState/g, "@/pages/deeds"],
  [/@\/hooks\/deeds\/useDeedsPage/g, "@/pages/deeds"],
  [/@\/hooks\/friends\/useAddFriendForm/g, "@/features/friend/add"],
  [/@\/hooks\/friends\/useFriendsPage/g, "@/pages/friends"],
  [/@\/hooks\/friends\/useFriendDeedsPage/g, "@/pages/friend-deeds"],
  [/@\/hooks\/settings\/useProfileForm/g, "@/features/profile/update"],
  [/@\/hooks\/settings\/useSettingsPage/g, "@/pages/settings"],
  [/@\/hooks\/auth\/useLoginForm/g, "@/features/auth/login"],
  [/@\/hooks\/auth\/useRegisterForm/g, "@/features/auth/register"],
  [/@\/hooks\/useCollapsibleForm/g, "@/shared/lib/use-collapsible-form"],
  [/@\/lib\/api\/errors/g, "@/shared/api/errors"],
  [/@\/lib\/api\/validation-errors/g, "@/shared/api/validation-errors"],
  [/@\/lib\/api\/form-mutation-errors/g, "@/shared/api/form-mutation-errors"],
  [/@\/lib\/api\/auth-form-errors/g, "@/shared/api/auth-form-errors"],
  [/@\/lib\/auth\/token/g, "@/shared/lib/auth/token"],
  [/@\/lib\/utils\/normalize-tag/g, "@/shared/lib/normalize-tag"],
  [/@\/lib\/types\/deed/g, "@/entities/deed"],
  [/@\/lib\/types\/user/g, "@/entities/user"],
  [/@\/lib\/types\/friend/g, "@/entities/friend"],
  [/@\/lib\/types\/auth/g, "@/entities/user"],
  [/@\/store\/deedsApi/g, "@/entities/deed"],
  [/@\/store\/usersApi/g, "@/entities/user"],
  [/@\/store\/friendsApi/g, "@/entities/friend"],
  [/@\/store\/authApi/g, "@/features/auth/api"],
  [/@\/store\/clear-auth-session/g, "@/shared/api/rtk/clear-auth-session"],
  [/@\/store\/authSlice/g, "@/shared/api/rtk/auth-slice"],
  [/@\/store\/uiSlice/g, "@/shared/api/rtk/ui-slice"],
  [/@\/store\/baseApi/g, "@/shared/api/rtk/base-api"],
  [/@\/store(?!\/)/g, "@/shared/api"],
  [/\.\/baseApi/g, "@/shared/api/rtk/base-api"],
  [/\.\/authSlice/g, "@/shared/api/rtk/auth-slice"],
  [/\.\/uiSlice/g, "@/shared/api/rtk/ui-slice"],
  [/\.\/clear-auth-session/g, "@/shared/api/rtk/clear-auth-session"],
  [/\.\/index/g, "@/shared/api"],
  [/\.\/authApi/g, "@/features/auth/api"],
  [/\.\/deedsApi/g, "@/entities/deed"],
  [/\.\/friendsApi/g, "@/entities/friend"],
  [/\.\/usersApi/g, "@/entities/user"],
];

function transform(content) {
  let out = content;
  for (const [from, to] of REPLACEMENTS) {
    out = out.replace(from, to);
  }
  return out;
}

function write(dest, content) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, transform(content), "utf8");
}

function read(rel) {
  return fs.readFileSync(path.join(SRC, rel), "utf8");
}

/** @type {Array<[string, string]>} */
const COPIES = [
  // shared ui
  ["components/ui/Loader.tsx", "shared/ui/loader/Loader.tsx"],
  ["components/ui/PrimaryButton.tsx", "shared/ui/primary-button/PrimaryButton.tsx"],
  ["components/ui/TextField.tsx", "shared/ui/text-field/TextField.tsx"],
  ["components/ui/TextButton.tsx", "shared/ui/text-button/TextButton.tsx"],
  ["components/ui/TextAreaField.tsx", "shared/ui/text-area-field/TextAreaField.tsx"],
  ["components/ui/DeedSkeletonCard.tsx", "shared/ui/deed-skeleton-card/DeedSkeletonCard.tsx"],
  ["components/ui/FriendSkeletonCard.tsx", "shared/ui/friend-skeleton-card/FriendSkeletonCard.tsx"],
  ["components/ui/ProfileSkeletonCard.tsx", "shared/ui/profile-skeleton-card/ProfileSkeletonCard.tsx"],
  ["components/feedback/ErrorBanner.tsx", "shared/ui/error-banner/ErrorBanner.tsx"],
  ["components/patterns/EmptyState.tsx", "shared/ui/empty-state/EmptyState.tsx"],
  ["components/patterns/ConfirmDialog.tsx", "shared/ui/confirm-dialog/ConfirmDialog.tsx"],
  ["components/patterns/FormErrorBanner.tsx", "shared/ui/form-error-banner/FormErrorBanner.tsx"],
  // shared api + lib
  ["lib/api/errors.ts", "shared/api/errors.ts"],
  ["lib/api/errors.test.ts", "shared/api/errors.test.ts"],
  ["lib/api/validation-errors.ts", "shared/api/validation-errors.ts"],
  ["lib/api/form-mutation-errors.ts", "shared/api/form-mutation-errors.ts"],
  ["lib/api/form-mutation-errors.test.ts", "shared/api/form-mutation-errors.test.ts"],
  ["lib/api/auth-form-errors.ts", "shared/api/auth-form-errors.ts"],
  ["lib/auth/token.ts", "shared/lib/auth/token.ts"],
  ["lib/utils/normalize-tag.ts", "shared/lib/normalize-tag.ts"],
  ["hooks/useCollapsibleForm.ts", "shared/lib/use-collapsible-form.ts"],
  ["store/baseApi.ts", "shared/api/rtk/base-api.ts"],
  ["store/authSlice.ts", "shared/api/rtk/auth-slice.ts"],
  ["store/uiSlice.ts", "shared/api/rtk/ui-slice.ts"],
  ["store/clear-auth-session.ts", "shared/api/rtk/clear-auth-session.ts"],
  ["store/index.ts", "shared/api/rtk/store.ts"],
  ["components/providers/StoreProvider.tsx", "shared/api/store-provider.tsx"],
  // entities types + api
  ["lib/types/deed.ts", "entities/deed/model/types.ts"],
  ["lib/types/user.ts", "entities/user/model/types.ts"],
  ["lib/types/friend.ts", "entities/friend/model/types.ts"],
  ["lib/types/auth.ts", "entities/user/model/auth-types.ts"],
  ["store/deedsApi.ts", "entities/deed/api/deeds-api.ts"],
  ["store/usersApi.ts", "entities/user/api/users-api.ts"],
  ["store/friendsApi.ts", "entities/friend/api/friends-api.ts"],
  ["store/authApi.ts", "features/auth/api/auth-api.ts"],
  // entities ui
  ["components/deeds/DeedCard.tsx", "entities/deed/ui/DeedCard.tsx"],
  ["components/deeds/DeedList.tsx", "entities/deed/ui/DeedList.tsx"],
  ["components/deeds/StatusBadge.tsx", "entities/deed/ui/StatusBadge.tsx"],
  ["components/friends/FriendCard.tsx", "entities/friend/ui/FriendCard.tsx"],
  ["components/friends/FriendsList.tsx", "entities/friend/ui/FriendsList.tsx"],
  ["components/friends/FriendDeedList.tsx", "entities/friend/ui/FriendDeedList.tsx"],
  ["components/friends/FriendDeedsHeader.tsx", "entities/friend/ui/FriendDeedsHeader.tsx"],
  ["components/friends/ForbiddenDeedsView.tsx", "entities/friend/ui/ForbiddenDeedsView.tsx"],
  ["components/friends/BackToFriendsLink.tsx", "entities/friend/ui/BackToFriendsLink.tsx"],
  // widgets
  ["components/patterns/PageShell.tsx", "widgets/page-shell/ui/PageShell.tsx"],
  ["components/patterns/PageHeader.tsx", "widgets/page-header/ui/PageHeader.tsx"],
  ["components/patterns/ListQueryState.tsx", "widgets/list-query-state/ui/ListQueryState.tsx"],
  ["components/layout/AppNav.tsx", "widgets/app-nav/ui/AppNav.tsx"],
  // features
  ["components/deeds/AddDeedForm.tsx", "features/deed/create/ui/AddDeedForm.tsx"],
  ["hooks/deeds/useAddDeedForm.ts", "features/deed/create/model/useAddDeedForm.ts"],
  ["hooks/deeds/useDeedEditForm.ts", "features/deed/edit/model/useDeedEditForm.ts"],
  ["hooks/deeds/useDeedMarkStatus.ts", "features/deed/mark-status/model/useDeedMarkStatus.ts"],
  ["components/deeds/DeleteDeedModal.tsx", "features/deed/delete/ui/DeleteDeedModal.tsx"],
  ["components/friends/AddFriendForm.tsx", "features/friend/add/ui/AddFriendForm.tsx"],
  ["hooks/friends/useAddFriendForm.ts", "features/friend/add/model/useAddFriendForm.ts"],
  ["components/friends/RemoveFriendModal.tsx", "features/friend/remove/ui/RemoveFriendModal.tsx"],
  ["components/auth/LoginForm.tsx", "features/auth/login/ui/LoginForm.tsx"],
  ["hooks/auth/useLoginForm.ts", "features/auth/login/model/useLoginForm.ts"],
  ["components/auth/RegisterForm.tsx", "features/auth/register/ui/RegisterForm.tsx"],
  ["hooks/auth/useRegisterForm.ts", "features/auth/register/model/useRegisterForm.ts"],
  ["components/auth/LogoutConfirmModal.tsx", "features/auth/logout/ui/LogoutConfirmModal.tsx"],
  ["components/auth/AuthReasonBanners.tsx", "features/auth/session-banners/ui/AuthReasonBanners.tsx"],
  ["components/auth/AuthFormErrorBanner.tsx", "features/auth/session-banners/ui/AuthFormErrorBanner.tsx"],
  ["components/auth/AuthGuard.tsx", "features/auth/guard/ui/AuthGuard.tsx"],
  ["components/auth/GuestAuthGuard.tsx", "features/auth/guard/ui/GuestAuthGuard.tsx"],
  ["components/auth/AuthPageLayout.tsx", "features/auth/layout/ui/AuthPageLayout.tsx"],
  ["components/auth/AuthCard.tsx", "features/auth/layout/ui/AuthCard.tsx"],
  ["components/settings/ProfileSettingsCard.tsx", "features/profile/update/ui/ProfileSettingsCard.tsx"],
  ["hooks/settings/useProfileForm.ts", "features/profile/update/model/useProfileForm.ts"],
  ["components/settings/DeleteAccountModal.tsx", "features/account/delete/ui/DeleteAccountModal.tsx"],
  // pages model + ui
  ["hooks/deeds/useDeedsPage.ts", "pages/deeds/model/useDeedsPage.ts"],
  ["hooks/deeds/useDeedListState.ts", "pages/deeds/model/useDeedListState.ts"],
  ["app/(app)/deeds/DeedsPage.tsx", "pages/deeds/ui/DeedsPage.tsx"],
  ["hooks/friends/useFriendsPage.ts", "pages/friends/model/useFriendsPage.ts"],
  ["app/(app)/friends/FriendsPage.tsx", "pages/friends/ui/FriendsPage.tsx"],
  ["hooks/friends/useFriendDeedsPage.ts", "pages/friend-deeds/model/useFriendDeedsPage.ts"],
  ["app/(app)/friends/[tag]/FriendDeedsPage.tsx", "pages/friend-deeds/ui/FriendDeedsPage.tsx"],
  ["hooks/settings/useSettingsPage.ts", "pages/settings/model/useSettingsPage.ts"],
  ["app/(app)/settings/SettingsPage.tsx", "pages/settings/ui/SettingsPage.tsx"],
  ["app/(auth)/login/LoginPage.tsx", "pages/login/ui/LoginPage.tsx"],
  ["app/(auth)/register/RegisterPage.tsx", "pages/register/ui/RegisterPage.tsx"],
  ["app/page.tsx", "pages/home/ui/HomePage.tsx"],
];

for (const [from, to] of COPIES) {
  write(path.join(SRC, to), read(from));
}

console.log(`Migrated ${COPIES.length} files.`);
