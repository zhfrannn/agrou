import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  declare state: State;
  declare props: Props;
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary] Caught error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
          <div className="bg-white rounded-2xl border border-red-100 shadow-md p-8 max-w-md w-full text-center">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="font-bold text-gray-800 text-lg mb-2">
              Terjadi Kesalahan
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              Halaman ini mengalami error. Coba muat ulang halaman.
            </p>
            {this.state.error && (
              <details className="text-left bg-gray-50 rounded-xl p-3 mb-4">
                <summary className="text-xs font-semibold text-gray-500 cursor-pointer">
                  Detail Error
                </summary>
                <pre className="text-[10px] text-red-600 mt-2 whitespace-pre-wrap break-all">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="bg-[#1B4D3E] text-white font-bold text-sm px-6 py-2.5 rounded-full hover:bg-[#163D30] transition-colors"
            >
              Muat Ulang
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
