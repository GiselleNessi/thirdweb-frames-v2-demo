# Getting Started with Frames v2 using thirdweb

In this guide, we'll integrate **thirdweb** with **Frames v2** and build a simple app that connects to the user's wallet, displays context data, and performs actions like opening URLs and closing the frame.

### **Step 1: Clone the Next.js Starter Repo**

To get started, clone the official **thirdweb Next.js starter template**:

```bash
git clone https://github.com/thirdweb-example/next-starter
cd next-starter
```

### **Step 2: Install Dependencies**

Next, install all the dependencies, including the **thirdweb SDK** and **Farcaster Frame SDK**:

```bash
# Install all dependencies
npm install

# Install the latest thirdweb SDK
npm install thirdweb

# Install @farcaster/frame-sdk to interact with Farcaster Frames
npm install @farcaster/frame-sdk
```

### **Step 3: Configure the thirdweb Client (`client.ts`)**

In the `client.ts` file, configure the **thirdweb client** using your `clientId`. This will allow your app to interact with the thirdweb API.

Create `client.ts` with the following code:

```

import { createThirdwebClient } from "thirdweb";

// Replace this with your client ID string from thirdweb's dashboard
const clientId = process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID;

if (!clientId) {
  throw new Error("No client ID provided");
}

export const client = createThirdwebClient({
  clientId: clientId,
});
```

### **Step 4: Set up `ThirdwebProvider` in Layout (`app/layout.tsx`)**

In the layout file, include the `ThirdwebProvider` to wrap your entire app and make thirdweb available globally. This is where the client is provided to the app.

```tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "thirdweb SDK + Next starter",
  description:
    "Starter template for using thirdweb SDK with Next.js App router",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThirdwebProvider>{children}</ThirdwebProvider>
      </body>
    </html>
  );
}

```

### **Step 5: Create the Demo Component (`app/components/Demo.tsx`)**

In the `Demo.tsx` component, we will add the **ConnectButton** from thirdweb to allow users to connect their wallet and display context information about the current user. We will also add actions like opening an external URL and closing the frame.

Here’s the full code for `Demo.tsx`:

```tsx
tsx
Copy
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

    const close = useCallback(() => {
        sdk.actions.close();
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
                <buttononClick={toggleContext}
                    className="flex items-center gap-2 transition-colors"
                >
                    <spanclassName={`transform transition-transform ${isContextOpen ? 'rotate-90' : ''}`}
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

```

### **Step 6: Test the Application Locally**

To test the application locally:

1. Run the development server:
    
    ```bash
    npm run dev
    ```
    
2. Open your browser and go to `http://localhost:3000` to see the app in action.
3. Use the **ConnectButton** from thirdweb to connect your wallet and interact with the context and actions.

---

### **Step 7: Expose Your App Using Ngrok**

To test the app in the **Warpcast Playground**, use **ngrok** to expose your local server.

1. Start the local server:
    
    ```bash
    npm run dev
    ```
    
2. Expose the local server using **ngrok**:
    
    ```bash
    ngrok http http://localhost:3000
    ```
    
3. Open the **Frame Playground** on **Warpcast**:
    - Visit: https://warpcast.com/~/developers/frame
    - Enter your ngrok URL.

### **Step 8: Calling `ready()`**

To make your frame app consistent with the loading experience, we need to signal that the app is ready. This is done by calling `sdk.actions.ready()` once the app has loaded. Here’s the updated `Demo.tsx` with this functionality:

```tsx
import { useEffect, useState } from 'react';
import sdk from '@farcaster/frame-sdk';

export default function Demo() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      sdk.actions.ready();
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);

  return (
    <div className="w-[300px] mx-auto py-4 px-2">
      <h1 className="text-2xl font-bold text-center mb-4">Frames v2 Demo</h1>
    </div>
  );
}
```

---

### **Next Steps: Add More Wallet Interactions**

Now that we’ve set up the basic functionality, here are the next steps you can take to further enhance wallet interactions:

1. **Send a Transaction:**
    - Use **thirdweb’s `useSendTransaction`** hook to send a transaction from the connected wallet.
2. **Sign Messages:**
    - Use **thirdweb’s `useSignMessage`** hook to sign arbitrary messages with the connected wallet.
3. **Sign Typed Data:**
    - Use **thirdweb’s `useSignTypedData`** hook to sign typed data (useful for EIP-712).
4. **Custom Smart Contract Interactions:**
    - Use **thirdweb’s `useWriteContract`** hook to interact with your smart contracts in a secure and type-safe manner.

---

### **Conclusion**

You have successfully built a **Frames v2** app integrated with **thirdweb** to enable wallet connection and interactions. You can now:

- Connect a wallet using the **ConnectButton** from thirdweb.
- View user context and perform actions such as opening URLs and closing frames.
