'use client';

import { useEffect, useState, useCallback } from 'react';
import sdk from '@farcaster/frame-sdk';
import { ConnectButton } from 'thirdweb/react';
import { client } from '../client';  // Assuming your client is configured here

export default function Demo() {
    const [isSDKLoaded, setIsSDKLoaded] = useState(false);
    const [context, setContext] = useState<any>(null);
    const [isContextOpen, setIsContextOpen] = useState(false);

    useEffect(() => {
        const load = async () => {
            // Ensure sdk.wallet is initialized properly
            if (sdk.wallet) {
                console.log("SDK Wallet is initialized");

                // Try to fetch context data
                try {
                    const contextData = await sdk.context;
                    console.log("Context Data:", contextData);
                    setContext(contextData); // Set context data to the state
                    sdk.actions.ready(); // Notify that the app is ready
                } catch (error) {
                    console.error("Error fetching context:", error);
                }
            } else {
                console.error("SDK wallet is not initialized");
            }
        };

        if (sdk && !isSDKLoaded) {
            setIsSDKLoaded(true);
            load();
        }
    }, [isSDKLoaded]);


    const toggleContext = useCallback(() => {
        setIsContextOpen((prev) => !prev);  // Toggle the context view
    }, []);

    const openUrl = useCallback(() => {
        sdk.actions.openUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');  // Replace with your URL
    }, []);

    if (!isSDKLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <div className="w-[300px] mx-auto py-4 px-2">
            <h1 className="text-2xl font-bold text-center mb-4">Frames v2 Demo</h1>

            {/* ConnectButton */}
            <ConnectButton client={client} />

            <div className="mt-4">
                <h2 className="font-2xl font-bold">Context</h2>
                <button
                    onClick={toggleContext}
                    className="flex items-center gap-2 transition-colors"
                >
                    <span
                        className={`transform transition-transform ${isContextOpen ? 'rotate-90' : ''
                            }`}
                    >
                        ➤
                    </span>
                    Tap to expand
                </button>

                {isContextOpen && context && (
                    <div className="p-4 mt-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[260px] overflow-x-">
                            {JSON.stringify(context, null, 2)}  {/* Display context data */}
                        </pre>
                    </div>
                )}
            </div>

            {/* Actions Section */}
            <div className="mt-4">
                <h2 className="font-2xl font-bold">Actions</h2>
                <button onClick={openUrl} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
                    Open External URL
                </button>
            </div>

            <div className="mt-4">
                <h2 className="font-2xl font-bold">Actions</h2>
                <button onClick={close} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">Close Frame</button>
            </div>


        </div>
    );
}
