import { useEffect, useRef, useCallback } from "react";
import toast from "react-hot-toast";

/**
+ * Custom hook Google Identity Services — bebas ESLint warning.
+ *
+ * Cara kerja:
+ *  - GSI di-initialize SEKALI saat mount (dep array kosong = tidak ada warning).
+ *  - Callback terbaru disimpan di useRef, sehingga tidak perlu re-init GSI
+ *    setiap kali parent re-render → tidak ada stale closure.
+ *
+ * @param {(idToken: string) => void} onCredential
 **/
const useGoogleAuth = (onCredential) => {
  // Simpan callback terbaru tanpa perlu re-run effect
  const onCredentialRef = useRef(onCredential);
  const initializedRef = useRef(false);
  const retryTimeoutRef = useRef(null);
  useEffect(() => {
    onCredentialRef.current = onCredential;
  }); // ← sengaja tanpa dep array: selalu sync, tidak perlu useCallback di parent

  // initGSI hanya dipanggil sekali, stabil (tidak recreated tiap render)
  const initGSI = useCallback(() => {
    if (window.__curevaGsiInitialized) {
      initializedRef.current = true;
      return;
    }
    if (initializedRef.current) return;

    const googleId = window.google?.accounts?.id;
    if (!googleId) {
      if (!retryTimeoutRef.current) {
        retryTimeoutRef.current = window.setTimeout(() => {
          retryTimeoutRef.current = null;
          initGSI();
        }, 200);
      }
      return;
    }

    googleId.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      use_fedcm_for_prompt: true,
      // Selalu panggil ref terbaru → tidak pernah stale
      callback: (response) => {
        if (!response.credential) {
          toast.error("Login Google gagal. Coba lagi.");
          return;
        }
        onCredentialRef.current(response.credential);
      },
    });
    initializedRef.current = true;
    window.__curevaGsiInitialized = true;
  }, []); // ← dep array kosong = tidak ada warning "missing dependency"

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    // Script sudah ada (misal pindah dari Login ke Register)?
    if (document.getElementById("gsi-script")) {
      initGSI();
      return;
    }

    const script = document.createElement("script");
    script.id = "gsi-script";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initGSI; // ← stabil karena useCallback([], [])
    document.head.appendChild(script);
    return () => {
      if (retryTimeoutRef.current) {
        window.clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
    };
  }, [initGSI]); // ← initGSI stabil → effect juga hanya jalan sekali

  const triggerGoogleLogin = useCallback(() => {
    if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
      toast.error("Google login belum dikonfigurasi");
      return;
    }
    window.google?.accounts?.id.prompt((notification) => {
      if (
        notification?.isNotDisplayed?.() ||
        notification?.isSkippedMoment?.()
      ) {
        toast.error("Prompt Google tidak ditampilkan. Coba izinkan popup.");
      }
    });
  }, []);

  return { triggerGoogleLogin };
};

export default useGoogleAuth;
