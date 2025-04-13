export const POLKADOT_SS58_FORMAT = 0;
export const KUSAMA_SS58_FORMAT = 2;

export const MNEMONIC = process.env.PROPOSER_MNEMONIC as string;

export const PASEO_PROVIDER = "wss://paseo.rpc.amforc.com";
export const KUSAMA_PROVIDER = "wss://kusama-rpc.polkadot.io";

export const BALANCE = 1000000000;

export const THRESHOLD = process.env.THRESHOLD as unknown as number;

export const MIMIR_URL = "https://mimir-client.mimir.global";

export const SUCCESS_PAGE = `
    <html>
        <head>
            <title>Refresh Successful</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                .success { color: green; font-size: 24px; margin-bottom: 20px; }
                .button { padding: 10px 20px; font-size: 16px; cursor: pointer; background: #28a745; color: white; border: none; border-radius: 5px; }
                .button:hover { background: #218838; }
            </style>
        </head>
        <body>
            <div class="success">✅ ReadyToVote transactions were sent to Mimir!</div>
        </body>
    </html>
`;
