"use client";

import { Provider } from "react-redux";
import { useEffect } from "react";
import {
  clearAuthSession,
  setCredentials,
  setHydrating,
  store,
  useAppDispatch,
} from "@/shared/api";
import { getStoredToken } from "@/shared/lib";
import { useLazyGetMeQuery } from "@/entities/user";

function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const [triggerGetMe] = useLazyGetMeQuery();

  useEffect(() => {
    const bootstrap = async () => {
      const token = getStoredToken();
      if (token) {
        dispatch(setCredentials({ accessToken: token }));
        try {
          const user = await triggerGetMe().unwrap();
          dispatch(setCredentials({ accessToken: token, user }));
        } catch {
          clearAuthSession(dispatch);
        }
      }
      dispatch(setHydrating(false));
    };

    void bootstrap();
  }, [dispatch, triggerGetMe]);

  return <>{children}</>;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthBootstrap>{children}</AuthBootstrap>
    </Provider>
  );
}
