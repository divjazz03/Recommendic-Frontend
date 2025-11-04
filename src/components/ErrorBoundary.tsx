import { Component, ErrorInfo, ReactNode } from "react";


interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {hasError: false}
    }

    static getDerivedStateFromError(error: Error): State {
        return {hasError: true, error}
    }

    componentDidCatch(error: Error, errorInfo: unknown): void {
        console.error('Error caught by boundary:', error, errorInfo)
    }

    render(): ReactNode {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="w-full h-full bg-gray-100 flex flex-col justify-center items-center">
                    <div className="flex bg-white rounded-lg p-4 flex-col gap-8">
                        <h2 className="text-xl"> Something went wrong</h2>
                        <button className="py-2 px-4 text-white rounded-lg bg-main-light hover:bg-main" onClick={() => this.setState({hasError: false})}>
                            Try again
                        </button>

                    </div>
                </div>
            )
        }

        return this.props.children
    }
}