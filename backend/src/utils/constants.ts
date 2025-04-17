export const POLKADOT_SS58_FORMAT = 0;
export const KUSAMA_SS58_FORMAT = 2;

export const MNEMONIC = process.env.PROPOSER_MNEMONIC as string;

export const PASEO_PROVIDER = "wss://paseo.rpc.amforc.com";
export const POLKADOT_PROVIDER = "wss://rpc.polkadot.io";
export const KUSAMA_PROVIDER = "wss://kusama-rpc.polkadot.io";

export const BALANCE = 1000000000;

export const THRESHOLD = process.env.THRESHOLD as unknown as number;

// Default ReadyToVote -> Completed check interval is 1 minute
export const READY_CHECK_INTERVAL = process.env.READY_CHECK_INTERVAL || 60; 

export const MIMIR_URL = "https://mimir-client.mimir.global";

export const TRACKS = [
  0, 1, 2, 10, 11, 12, 13, 14, 15, 20, 21, 30, 31, 32, 33, 34,
];

const POLKADOT_LOGO =
  "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMjciIGhlaWdodD0iMTAyNyI+CjxwYXRoIGQ9Ik0wIDAgQzMuMzk0MDM5MTEgMC4wMTcwOTA3NSA2Ljc4NzM3MTcgMC4wMDY4ODE3NCAxMC4xODEzODY5NSAtMC4wMTAzMTU5IEMzNS45NDUwNDkxOCAtMC4xMjA3NTQzMSA2MS41MjM3MjE3OCAxLjc1OTU5NzIxIDg2Ljk0Nzc1MzkxIDYuMDc4NjEzMjggQzg3LjY5ODcxMzM4IDYuMjAzMjc5NzIgODguNDQ5NjcyODUgNi4zMjc5NDYxNyA4OS4yMjMzODg2NyA2LjQ1NjM5MDM4IEMxMTYuMjU4NTI4ODYgMTAuOTY5MTQ3ODYgMTQyLjU4MjMwNDEyIDE3LjY4NzEyMjc5IDE2OC41NzI3NTM5MSAyNi4zOTExMTMyOCBDMTY5LjYxNjI1IDI2LjczNzIyNjU2IDE3MC42NTk3NDYwOSAyNy4wODMzMzk4NCAxNzEuNzM0ODYzMjggMjcuNDM5OTQxNDEgQzIzMC40MjQ2MzAzNSA0Ny4xMDI2OTIzNiAyODUuMTU0MjQ1NTggNzguNzM1NTI1ODMgMzMyLjU3Mjc1MzkxIDExOC4zOTExMTMyOCBDMzMzLjM2Mjg2ODY1IDExOS4wNTE2NzcyNSAzMzMuMzYyODY4NjUgMTE5LjA1MTY3NzI1IDMzNC4xNjg5NDUzMSAxMTkuNzI1NTg1OTQgQzM0Ny4zODQ2NDQ5IDEzMC44MTI1ODIyMyAzNTkuODUzMzY1NTggMTQyLjU5Mzc0ODQ0IDM3Mi4wNzI3NTM5MSAxNTQuNzY2MTEzMjggQzM3My4zMjc4OTc5NSAxNTYuMDE0MjQ4MDUgMzczLjMyNzg5Nzk1IDE1Ni4wMTQyNDgwNSAzNzQuNjA4Mzk4NDQgMTU3LjI4NzU5NzY2IEMzNzkuNDcwMjU4NDEgMTYyLjE2MjE0MTU5IDM4NC4wOTM2MjAyMiAxNjcuMTY1MDAyOTUgMzg4LjU3Mjc1MzkxIDE3Mi4zOTExMTMyOCBDMzg5LjU5NDI0OTgyIDE3My41NDc3Nzg3OSAzOTAuNjE3NjQ1MyAxNzQuNzAyNzY5OSAzOTEuNjQzMDY2NDEgMTc1Ljg1NTk1NzAzIEMzOTkuMTIzMDY2NjQgMTg0LjMzMTc1NDI4IDQwNi4xMzAzMjA4NyAxOTMuMDgxMjU0MjYgNDEyLjg5MTYwMTU2IDIwMi4xMzkxNjAxNiBDNDE0LjAzMzcwOTc0IDIwMy42NjkwNDc3MyA0MTUuMTc5MzQ3NjQgMjA1LjE5NjMwNTI5IDQxNi4zMjgxMjUgMjA2LjcyMTE5MTQxIEM0MzQuOTU1MDIyMTMgMjMxLjQ0ODUxMTgzIDQ1MC42NTA4OTUyNyAyNTcuNzQ5NTYxNiA0NjQuNTcyNzUzOTEgMjg1LjM5MTExMzI4IEM0NjUuMDYwOTg2MzMgMjg2LjM0NzU5NzY2IDQ2NS41NDkyMTg3NSAyODcuMzA0MDgyMDMgNDY2LjA1MjI0NjA5IDI4OC4yODk1NTA3OCBDNDkyLjgzMzExMDQ1IDM0MC45Njg1ODc4NSA1MDguMzY3OTE3MjQgMzk4Ljg3NzcwMTg3IDUxNC44ODUyNTM5MSA0NTcuNDUzNjEzMjggQzUxNS4wMDc0OTMyOSA0NTguNTUwMjYzMDYgNTE1LjAwNzQ5MzI5IDQ1OC41NTAyNjMwNiA1MTUuMTMyMjAyMTUgNDU5LjY2OTA2NzM4IEM1MTcuMDg5MTA2MTUgNDc3LjUxNzYwNzg3IDUxNy43ODA2NTkxMSA0OTUuMjUxMTg2NSA1MTcuNzYwMjUzOTEgNTEzLjIwMzYxMzI4IEM1MTcuNzU5NjQ5NjYgNTE0LjE5MTc4MDQgNTE3Ljc1OTA0NTQxIDUxNS4xNzk5NDc1MSA1MTcuNzU4NDIyODUgNTE2LjE5ODA1OTA4IEM1MTcuNzMxNzMyNjMgNTMyLjM0MzM2NzY3IDUxNy4yODQwMzc0NyA1NDguMzIzNDA4MTYgNTE1LjU3Mjc1MzkxIDU2NC4zOTExMTMyOCBDNTE1LjQ0OTE2NTA0IDU2NS41NzYwODM5OCA1MTUuMzI1NTc2MTcgNTY2Ljc2MTA1NDY5IDUxNS4xOTgyNDIxOSA1NjcuOTgxOTMzNTkgQzUwOS4yMzQxNzcwMiA2MjMuMTk4MzMzMjggNDk0LjYzODIyMjQ2IDY3Ni44NjYzODMyOCA0NzEuNTcyNzUzOTEgNzI3LjM5MTExMzI4IEM0NzAuODg2ODExNTIgNzI4LjkwNTM1ODg5IDQ3MC44ODY4MTE1MiA3MjguOTA1MzU4ODkgNDcwLjE4NzAxMTcyIDczMC40NTAxOTUzMSBDNDYzLjQ1MDg2NzE0IDc0NS4yMjk0NjE0MSA0NTUuODA2NjE1MTQgNzU5LjM5NjEyMjI3IDQ0Ny41NzI3NTM5MSA3NzMuMzkxMTEzMjggQzQ0Ni44NjExOTE0MSA3NzQuNjAzMjM0ODYgNDQ2Ljg2MTE5MTQxIDc3NC42MDMyMzQ4NiA0NDYuMTM1MjUzOTEgNzc1LjgzOTg0Mzc1IEM0MzIuOTU4NTM4MDQgNzk4LjE1NTA5ODcxIDQxOC4wNzkxNTU2OCA4MTkuOTEzNTM0NzcgNDAxLjA3Mjc1MzkxIDgzOS40OTI2NzU3OCBDMzk4LjczNDc5MSA4NDIuMjAzMjUxNTMgMzk2LjQ5MjExNTI4IDg0NC45NjgwODExOSAzOTQuMjYwMjUzOTEgODQ3Ljc2NjExMzI4IEMzODQuNTEwMTY4OTUgODU5LjY3NzIxMTgzIDM3My41NTU3ODE1MyA4NzAuNTAyNTk4OTMgMzYyLjY5Nzc1MzkxIDg4MS4zOTExMTMyOCBDMzYyLjE1Nzk1ODk4IDg4MS45MzM1ODcwNCAzNjEuNjE4MTY0MDYgODgyLjQ3NjA2MDc5IDM2MS4wNjIwMTE3MiA4ODMuMDM0OTczMTQgQzM1NS4wNzk2MjM2OSA4ODkuMDM5ODYzMzEgMzQ5LjA0Mzc0NTQ5IDg5NC45MDc4OTQyMyAzNDIuNTcyNzUzOTEgOTAwLjM5MTExMzI4IEMzNDEuNDg5MzAyMTEgOTAxLjM0MDAxNDU5IDM0MC40MDcyMjE3OSA5MDIuMjkwNDg0NiAzMzkuMzI2NjYwMTYgOTAzLjI0MjY3NTc4IEMzMzAuMzgzOTY1MzggOTExLjA0MzE4NzU0IDMyMS4wOTY2MjI5IDkxOC4zMTUyMjIwNSAzMTEuNTcyNzUzOTEgOTI1LjM5MTExMzI4IEMzMTAuODM0NzY1NjMgOTI1LjkzOTQ0ODI0IDMxMC4wOTY3NzczNCA5MjYuNDg3NzgzMiAzMDkuMzM2NDI1NzggOTI3LjA1MjczNDM4IEMyOTguNjg0NDkyMyA5MzQuOTMwNjMwNDQgMjg3LjgxMTIyNjEzIDk0Mi4zNzUzMzE3MyAyNzYuNTcyNzUzOTEgOTQ5LjM5MTExMzI4IEMyNzUuOTY0MzE2NDEgOTQ5Ljc3MTg3MDEyIDI3NS4zNTU4Nzg5MSA5NTAuMTUyNjI2OTUgMjc0LjcyOTAwMzkxIDk1MC41NDQ5MjE4OCBDMjYzLjI5MzczNTY5IDk1Ny42NTc0ODMxNiAyNTEuNDY3NjQwMzIgOTY0LjA4NTcxMjU4IDIzOS41NzI3NTM5MSA5NzAuMzkxMTEzMjggQzIzOC43MDI5NTg5OCA5NzAuODUyNzU4NzkgMjM3LjgzMzE2NDA2IDk3MS4zMTQ0MDQzIDIzNi45MzcwMTE3MiA5NzEuNzkwMDM5MDYgQzE2MS4xMTMxMzY2MSAxMDExLjY4NTk5MTU1IDczLjk2MTU4MTUgMTAyOS43NjU2NzUzNCAtMTQ1LjY5NDAzMDc2IDEwMDUuNjg4MDQ5MzIgQy0xNjYuNzEyMjQzMTMgOTk5LjA0NzEzMzUyIC0xODcuMzc5NDEwODYgOTkxLjU3OTcwNDQzIC0yMDcuNDI3MjQ2MDkgOTgyLjM5MTExMzI4IEMtMjA5LjA4MjQwMjM0IDk4MS42MzM2Mjc5MyAtMjA5LjA4MjQwMjM0IDk4MS42MzM2Mjc5MyAtMjEwLjc3MDk5NjA5IDk4MC44NjA4Mzk4NCBDLTIyNi43NzQ5NTU4MyA5NzMuNDcyNjQ4MjEgLTI0Mi4yNTM2ODE2MSA5NjUuMzU3NTY5MDggLTI1Ny40MjcyNDYwOSA5NTYuMzkxMTEzMjggQy0yNTguMjQ1NDc4NTIgOTU1LjkwOTAwMzkxIC0yNTkuMDYzNzEwOTQgOTU1LjQyNjg5NDUzIC0yNTkuOTA2NzM4MjggOTU0LjkzMDE3NTc4IEMtMjgzLjM5OTIxNjQgOTQxLjAxNzI0ODA0IC0zMDUuNDg3MTIyMiA5MjQuODkyNzI5NzUgLTMyNi40MjcyNDYwOSA5MDcuMzkxMTEzMjggQy0zMjcuMDEyODAyNzMgOTA2LjkwNDY1MzMyIC0zMjcuNTk4MzU5MzcgOTA2LjQxODE5MzM2IC0zMjguMjAxNjYwMTYgOTA1LjkxNjk5MjE5IEMtMzQ0LjkxMzAyMjI5IDg5MS45OTcxMzM2NCAtMzYxLjU5OTk3OTQxIDg3Ny4wMDU3MjczOCAtMzc1LjY5Njc3NzM0IDg2MC40MDI4MzIwMyBDLTM3Ny44NDI1Nzg4MyA4NTcuOTA4Mjc3MjUgLTM4MC4wNzMxMDI4NyA4NTUuNDk4OTIzNDYgLTM4Mi4zMDIyNDYwOSA4NTMuMDc4NjEzMjggQy0zODcuMjE5NDMxNjIgODQ3LjY3NDEzOTA5IC0zOTEuODg0NDk2ODggODQyLjExMTg2MDUzIC0zOTYuNDI3MjQ2MDkgODM2LjM5MTExMzI4IEMtMzk2LjkzMjM5NzQ2IDgzNS43NTg1MDU4NiAtMzk3LjQzNzU0ODgzIDgzNS4xMjU4OTg0NCAtMzk3Ljk1ODAwNzgxIDgzNC40NzQxMjEwOSBDLTQxNy41MjA2MzE2MyA4MDkuOTEyNDgxMTQgLTQzNC4zMzc5MTQ1NCA3ODMuOTA3MjMxODYgLTQ0OS40MjcyNDYwOSA3NTYuMzkxMTEzMjggQy00NDkuOTEwODA1NjYgNzU1LjUxMTk3MjY2IC00NTAuMzk0MzY1MjMgNzU0LjYzMjgzMjAzIC00NTAuODkyNTc4MTIgNzUzLjcyNzA1MDc4IEMtNDg3LjEzNjU1Njg3IDY4Ny40MjM3MzA3NiAtNTA5LjM2MzEwOTY3IDYwNy45NzI4Nzg1NyAtNTA5LjYzMDM3MTA5IDUzMi4wNjI5ODgyOCBDLTUwOS42Mzc0MzI2OSA1MzAuNzE0MDY1MTkgLTUwOS42NDQ1NjUzOSA1MjkuMzY1MTQyNDYgLTUwOS42NTE3NjM5MiA1MjguMDE2MjIwMDkgQy01MDkuNjcxMzExMzQgNTIzLjcyNDUxMjMyIC01MDkuNjc2NDU2MTUgNTE5LjQzMjg2MTM5IC01MDkuNjc3MjQ2MDkgNTE1LjE0MTExMzI4IEMtNTA5LjY3NzU0MDY2IDUxNC40MTAxMDUzMiAtNTA5LjY3NzgzNTI0IDUxMy42NzkwOTczNyAtNTA5LjY3ODEzODczIDUxMi45MjU5Mzc2NSBDLTUwOS42Nzk1NDg2IDQ5MS4yODQ2MTcwOCAtNTA5LjU1NDQyMDgzIDQ2OS44NTQ5MDM1MiAtNTA2LjQyNzI0NjA5IDQ0OC4zOTExMTMyOCBDLTUwNi4zMjc3ODY4NyA0NDcuNjk2MTI3MzIgLTUwNi4yMjgzMjc2NCA0NDcuMDAxMTQxMzYgLTUwNi4xMjU4NTQ0OSA0NDYuMjg1MDk1MjEgQy00OTguNDM1MDQ2MDMgMzkyLjc1MDI1MTggLTQ4My45NjQ3NDI0MSAzNDEuMTgwODEwNTMgLTQ2MC40MjcyNDYwOSAyOTIuMzkxMTEzMjggQy00NTkuOTM1MzA3NjIgMjkxLjM1OTU0MTAyIC00NTkuNDQzMzY5MTQgMjkwLjMyNzk2ODc1IC00NTguOTM2NTIzNDQgMjg5LjI2NTEzNjcyIEMtNDQ4LjEzMDU3ODU3IDI2Ni42ODY4ODk3MiAtNDM1Ljc2NzYzNjYyIDI0NC45MjQ4NDA5MSAtNDIxLjQyNzI0NjA5IDIyNC4zOTExMTMyOCBDLTQyMC43MzIzNjA4NCAyMjMuMzgzOTUyNjQgLTQyMC43MzIzNjA4NCAyMjMuMzgzOTUyNjQgLTQyMC4wMjM0Mzc1IDIyMi4zNTY0NDUzMSBDLTQxMC42ODgxMDMyMSAyMDguODI4MzU2MzMgLTQwMC43MjkyNjA2NyAxOTUuOTY1MzU0MDIgLTM5MC4wNDQ0MzM1OSAxODMuNDgwOTU3MDMgQy0zODcuNjA4MjQyOSAxODAuNjI1Njg0NiAtMzg1LjI2NjkxODEyIDE3Ny43MDExMTExMSAtMzgyLjkyNzI0NjA5IDE3NC43NjYxMTMyOCBDLTM3OC45MTk0NjM1IDE2OS44MzE4MDAzIC0zNzQuNTMxOTE2NjUgMTY1LjM5NzE0ODY2IC0zNjkuOTk3NTU4NTkgMTYwLjk1NzUxOTUzIEMtMzY3LjE5MzI2MDA0IDE1OC4xNTc0ODI4MyAtMzY0LjYxMDMxNjcgMTU1LjIyOTMyNjI3IC0zNjIuMDMyNzE0ODQgMTUyLjIyMzE0NDUzIEMtMzU3LjY3Mzk1MzA4IDE0Ny4yNDkyNzc3IC0zNTIuODU0OTYzMzUgMTQyLjgzOTA5MDkyIC0zNDcuODQ5MTIxMDkgMTM4LjUzMTczODI4IEMtMzQ1LjMzMTQ0NTA3IDEzNi4zMDY0Mzc1NCAtMzQyLjg4MDUwMjE4IDEzNC4wMjEyODAxMyAtMzQwLjQzMTM5NjQ4IDEzMS43MjExOTE0MSBDLTMzMy45NzIyNzgyOSAxMjUuNjU4NzY5NDkgLTMyNy4zODAzNDQ4NiAxMTkuODg4MDE1MjIgLTMyMC40MjcyNDYwOSAxMTQuMzkxMTEzMjggQy0zMTkuMzczNTc3NDcgMTEzLjU0NTExMTcxIC0zMTguMzIwMjA0OTIgMTEyLjY5ODc0MTMxIC0zMTcuMjY3MDg5ODQgMTExLjg1MjA1MDc4IEMtMjQ4LjU3NDMzODQxIDU2LjkzMTg4MDcyIC0xNjcuMTA2MjM4MzkgMjEuMjUzMDMwNTEgMCAwIFogIiBmaWxsPSIjRTYwMDdBIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg1MDkuNDI3MjQ2MDkzNzUsLTAuMzkxMTEzMjgxMjUpIi8+CjxwYXRoIGQ9Ik0wIDAgQzMuNjE3NDM5NiAyLjc1NjgzOTA1IDYuODM2NjIyODQgNS43MzcyMTkxMiAxMCA5IEMxMC41ODM5NDUzMSA5LjU3NDkyMTg3IDExLjE2Nzg5MDYzIDEwLjE0OTg0Mzc1IDExLjc2OTUzMTI1IDEwLjc0MjE4NzUgQzI0LjIxMTMyMjU2IDIzLjkwODQzNzU0IDI0LjcxODE0MDgxIDQyLjk3NDIzODMxIDI0LjM0Mzc1IDYwLjAwNzgxMjUgQzIyLjg0ODA1NTEzIDk4LjI2NTU1MDY5IDEwLjMyNzA5MDU3IDEzNC45ODM4NzAyOSAtMTIgMTY2IEMtMTIuMzkxNzEzODcgMTY2LjU1Mzk3NDYxIC0xMi43ODM0Mjc3MyAxNjcuMTA3OTQ5MjIgLTEzLjE4NzAxMTcyIDE2Ny42Nzg3MTA5NCBDLTMyLjE4NTY0MDM3IDE5NC4yNjg5NTY1NiAtNjQuMzk4MzQ1ODcgMjI0Ljg3NTQzMDEzIC05Ny45Mzc1IDIzMC42MTcxODc1IEMtMTEyLjU1NTQ1Njg4IDIzMi40NDQ0MzIxMSAtMTI3LjI2NTgzMTkgMjMwLjM4NDUxMDY3IC0xMzkuMTg3NSAyMjEuMzEyNSBDLTE1NC44ODg0MjM4NiAyMDcuOTcwNDAwMzggLTE1OS42MzQ0NjE4OSAxOTAuMjkxNDg3ODggLTE2MS40OTczMTQ0NSAxNzAuNDk3MDcwMzEgQy0xNjQuNjk1MTA1ODMgMTMwLjg3Mjc0OTY4IC0xNDcuMjI4MjAzMSA4NC45NTgyNTk1MiAtMTIzIDU0IEMtMTIyLjE3MDUxNjkyIDUyLjg5NDI0NjYzIC0xMjEuMzQyNDczNjQgNTEuNzg3NDEyMiAtMTIwLjUxNTYyNSA1MC42Nzk2ODc1IEMtMTExLjA5Mzk1MjY2IDM4LjIwMTAyOTE3IC0xMDAuMzM4NTUxMjYgMjcuNjA5Mjg2NDcgLTg4IDE4IEMtODYuODgwNDQ5MjIgMTcuMDk3MDExNzIgLTg2Ljg4MDQ0OTIyIDE3LjA5NzAxMTcyIC04NS43MzgyODEyNSAxNi4xNzU3ODEyNSBDLTYwLjIwNTMxMjM5IC00LjIyMzA4OTc0IC0zMC44MTY3NjQxOSAtMTguNjI0MzUxNzUgMCAwIFogIiBmaWxsPSIjRkRGREZEIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzMzQsMjU5KSIvPgo8cGF0aCBkPSJNMCAwIEMwLjg5Mzg4OTMxIC0wLjAwOTc5Mzg1IDEuNzg3Nzc4NjMgLTAuMDE5NTg3NzEgMi43MDg3NTU0OSAtMC4wMjk2NzgzNCBDMjkuNzIyNjkyNjEgLTAuMjY0NjkxNTEgNTQuNjk1NTA0ODQgMS4yMTc0MTU2NCA4MC40MTAxNTYyNSAxMC4yMzgyODEyNSBDODEuNDE1NjI1IDEwLjU4MTk3NzU0IDgxLjQxNTYyNSAxMC41ODE5Nzc1NCA4Mi40NDE0MDYyNSAxMC45MzI2MTcxOSBDOTYuNTkwNjEyNDEgMTUuODQ2MzI4NCAxMTAuMDMxMTYzNjIgMjMuNDg0ODU5IDEyMS40MTAxNTYyNSAzMy4yMzgyODEyNSBDMTIyLjE0MjM0Mzc1IDMzLjgxNTc4MTI1IDEyMi44NzQ1MzEyNSAzNC4zOTMyODEyNSAxMjMuNjI4OTA2MjUgMzQuOTg4MjgxMjUgQzEzMi42ODY2NDA0MiA0Mi40MzI5OTQyNyAxNDEuMzM1MDk2OCA1My40NjEyODgyMyAxNDMuNDEwMTU2MjUgNjUuMjM4MjgxMjUgQzE0NC4zNjkwNjE0MSA3NS44MTI0NDk1OCAxNDQuOTgyMzc3NzQgODYuODQ3MDkxNzcgMTM5LjQxMDE1NjI1IDk2LjIzODI4MTI1IEMxMzguOTg2MDU0NjkgOTcuMDQ5MTAxNTYgMTM4LjU2MTk1MzEyIDk3Ljg1OTkyMTg4IDEzOC4xMjUgOTguNjk1MzEyNSBDMTI0Ljc5NTYwMzE4IDEyMi44NjY0NDcxMyA5NS45MTQyMjEyMyAxMzcuMjE3NDM5NDEgNzAuNTg1OTM3NSAxNDUuNTQ2ODc1IEM2Ni44ODY3NzUzNCAxNDYuNjExNDcxNSA2My4xNzc2OTE3NiAxNDcuNDY1MjU0MTMgNTkuNDEwMTU2MjUgMTQ4LjIzODI4MTI1IEM1OC41OTkwMTM2NyAxNDguNDE3Mjk5OCA1Ny43ODc4NzEwOSAxNDguNTk2MzE4MzYgNTYuOTUyMTQ4NDQgMTQ4Ljc4MDc2MTcyIEMzMC42ODc2Njg4NyAxNTQuNDYyMjg5MzQgMy44MzI1Njg5IDE1My4zMzM4NjQ0OSAtMjIuNTg5ODQzNzUgMTQ5LjIzODI4MTI1IEMtMjQuMDA2NDQyODcgMTQ5LjAyMTQ3NzA1IC0yNC4wMDY0NDI4NyAxNDkuMDIxNDc3MDUgLTI1LjQ1MTY2MDE2IDE0OC44MDAyOTI5NyBDLTQ4LjU3NTQ3OTUxIDE0NS4xMzYzNTAzNyAtNjkuMTk0OTQxODMgMTM3LjQ0NzQzMzcyIC04OC41ODk4NDM3NSAxMjQuMjM4MjgxMjUgQy04OS4zMjQ2MDkzOCAxMjMuNzUxMDE1NjMgLTkwLjA1OTM3NSAxMjMuMjYzNzUgLTkwLjgxNjQwNjI1IDEyMi43NjE3MTg3NSBDLTkyLjQ1MDgxNzcyIDEyMS42NDgyMzUyNCAtOTQuMDI4NzcxOTkgMTIwLjQ1MjQ0ODE4IC05NS41ODk4NDM3NSAxMTkuMjM4MjgxMjUgQy05NS41ODk4NDM3NSAxMTguNTc4MjgxMjUgLTk1LjU4OTg0Mzc1IDExNy45MTgyODEyNSAtOTUuNTg5ODQzNzUgMTE3LjIzODI4MTI1IEMtOTYuNDYzODI4MTMgMTE2Ljg1OTI5Njg4IC05Ni40NjM4MjgxMyAxMTYuODU5Mjk2ODggLTk3LjM1NTQ2ODc1IDExNi40NzI2NTYyNSBDLTEwNS45NDU5MTIxNyAxMTEuNzI2ODg2ODEgLTExMy4xMjM1NDE5MyA5OS40MDEyMDc3MiAtMTE2LjI0NTYwNTQ3IDkwLjMzMzc0MDIzIEMtMTE5LjgzMjMxNzM3IDc3LjM3MDcwNDMgLTExOC40OTEyMjA4MyA2My45NjA4NzQxMSAtMTExLjk0MTQwNjI1IDUyLjMwNDY4NzUgQy0xMDguOTQzNzgzMDUgNDcuMzc2MjgwOCAtMTA1Ljg5NzAwNjc1IDQzLjExNDcyNzk1IC0xMDEuNTg5ODQzNzUgMzkuMjM4MjgxMjUgQy0xMDEuMTI1NzgxMjUgMzguNzMyOTY4NzUgLTEwMC42NjE3MTg3NSAzOC4yMjc2NTYyNSAtMTAwLjE4MzU5Mzc1IDM3LjcwNzAzMTI1IEMtOTQuNzQ1MTg1NzMgMzEuODQyMDgxNDIgLTg4LjIzNzI5MDQ3IDI3LjU5MjY3ODQ0IC04MS41ODk4NDM3NSAyMy4yMzgyODEyNSBDLTgwLjc2NDg0Mzc1IDIyLjY5MDQyOTY5IC03OS45Mzk4NDM3NSAyMi4xNDI1NzgxMiAtNzkuMDg5ODQzNzUgMjEuNTc4MTI1IEMtNTYuMDM0NTg1MDQgNi45NzM4NjQ4NCAtMjcuMDU3Njg0MDkgMC4yNDYwMTAxNSAwIDAgWiAiIGZpbGw9IiNGREZERkQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDUwMC41ODk4NDM3NSw3MjMuNzYxNzE4NzUpIi8+CjxwYXRoIGQ9Ik0wIDAgQzEuNzQ3OTY4NzUgMC41MDg1MzUxNiAxLjc0Nzk2ODc1IDAuNTA4NTM1MTYgMy41MzEyNSAxLjAyNzM0Mzc1IEMyOC4yMDM2MTUxNiA4Ljk3Nzk1NjgzIDUwLjQ2MzM3ODAxIDI3LjYxMjE0NzA2IDY2IDQ4IEM2Ni41Mjg1MTU2MyA0OC42NzQxNzk2OSA2Ny4wNTcwMzEyNSA0OS4zNDgzNTkzNyA2Ny42MDE1NjI1IDUwLjA0Mjk2ODc1IEM4OS40NTU2MjE2IDc4LjM4MzEyNTYgMTA0Ljg2NjQzODgxIDExMC43MjAwNzQ2NCAxMTEgMTQ2IEMxMTEuMTk1OTM3NSAxNDcuMDk1NzAzMTIgMTExLjM5MTg3NSAxNDguMTkxNDA2MjUgMTExLjU5Mzc1IDE0OS4zMjAzMTI1IEMxMTQuMDg5NjI5ODYgMTcxLjkyNzIyNDMgMTEzLjA1MTkyNjMzIDE5Ny45MDYzNjg3MiA5OC44NzEwOTM3NSAyMTYuNzIyNjU2MjUgQzkwLjcwMTk3NzMgMjI2LjY2NTQ0MzA4IDgxLjA4OTY2NTM1IDIzMy44MzM2MjM4NiA2Ny45MTU1MjczNCAyMzUuMjE5MjM4MjggQzQ1LjQxOTE5NTA1IDIzNi40NjUyNjkyIDIzLjU5NzEzMDU1IDIyNy44OTcyMjEwNSA2IDIxNCBDNC41NzQ5NDE0MSAyMTIuOTgyOTI5NjkgNC41NzQ5NDE0MSAyMTIuOTgyOTI5NjkgMy4xMjEwOTM3NSAyMTEuOTQ1MzEyNSBDLTM1LjM5MzI1MTgyIDE4My44NzQ3MzQyNiAtNjQuMzE1NDI4MTUgMTMzLjg1NzU5NjY0IC03Mi4zNDM3NSA4Ni45OTM0MDgyIEMtNzMuMjQ0MTI4ODkgODAuMTcyMjM0MTcgLTczLjIyMTA2MTI5IDczLjI4Nzc3MTE2IC03My4yNDAyMzQzOCA2Ni40MTgyMTI4OSBDLTczLjI0OTkwMTUyIDY0LjMzMzczNDkyIC03My4yODA5OTg4MSA2Mi4yNTAyNjIwMyAtNzMuMzEyNSA2MC4xNjYwMTU2MiBDLTczLjQ1Mzg5NyA0Mi40MDQwMDI2IC02OS41NTYyNjM3NCAyNC4yNjk5ODgyIC01NyAxMSBDLTQwLjE2ODE3NTIgLTUuNDA2OTQzNzggLTIxLjgxMDY0MDg3IC02LjU1MDg0MTI4IDAgMCBaICIgZmlsbD0iI0ZERkRGRCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjQ2LDU0MSkiLz4KPHBhdGggZD0iTTAgMCBDMS4yODA0ODQ3IC0wLjAwODU1MDExIDEuMjgwNDg0NyAtMC4wMDg1NTAxMSAyLjU4NjgzNzc3IC0wLjAxNzI3Mjk1IEM0LjM4OTUwMzgyIC0wLjAyNjY3MTgzIDYuMTkyMTg2NjUgLTAuMDMzMjM2NDUgNy45OTQ4NzMwNSAtMC4wMzcxMDkzOCBDMTAuNjg1MDYwMjIgLTAuMDQ2NzEyOSAxMy4zNzQ0NDc5NiAtMC4wNzc3NDI0MiAxNi4wNjQ0NTMxMiAtMC4xMDkzNzUgQzMyLjU5MDE4MDUzIC0wLjIxMDcwNjI4IDQ4LjQzMDQ4NjQ0IDEuOTAyNDg5MjEgNjQuMjUgNi43NjE3MTg3NSBDNjUuMDA0OTA3MjMgNi45OTM1ODg4NyA2NS43NTk4MTQ0NSA3LjIyNTQ1ODk4IDY2LjUzNzU5NzY2IDcuNDY0MzU1NDcgQzY3LjMyMzEyMDEyIDcuNzA4MTQ5NDEgNjguMTA4NjQyNTggNy45NTE5NDMzNiA2OC45MTc5Njg3NSA4LjIwMzEyNSBDNjkuNzYxNDk5MDIgOC40NjEwOTg2MyA3MC42MDUwMjkzIDguNzE5MDcyMjcgNzEuNDc0MTIxMDkgOC45ODQ4NjMyOCBDODguODM5NjY2MjggMTQuMzQ1NjI5MjIgMTA0Ljg4MDY1NjMyIDIwLjM5MDc0NjgxIDExOC45MTc5Njg3NSAzMi4yMDMxMjUgQzExOS44MTI1NzgxMiAzMi45MzUzMTI1IDEyMC43MDcxODc1IDMzLjY2NzUgMTIxLjYyODkwNjI1IDM0LjQyMTg3NSBDMTMxLjY2MzMxMDIxIDQyLjk3OTc0NTA0IDE0MS4zNjY3MTg4IDU1LjY3Mjc3ODIyIDE0Mi45MTc5Njg3NSA2OS4yMDMxMjUgQzE0My45Mjc2MjY4NyA4Ni4yOTUxOTQ2IDE0MC4xMjE4NDYyMiA5OC45MjY2Njg5OSAxMjguOTE3OTY4NzUgMTEyLjI2NTYyNSBDMTA4LjkzMTkwMzUyIDEzMy4zMzIwMTgwOCA3OS41NTIwOTczOSAxNDQuMjk5Mjg3NzkgNTEuNjA1NDY4NzUgMTQ5LjQ1MzEyNSBDNTAuNzIzMjY2NiAxNDkuNjE2MjcxOTcgNDkuODQxMDY0NDUgMTQ5Ljc3OTQxODk1IDQ4LjkzMjEyODkxIDE0OS45NDc1MDk3NyBDMS45OTY1Njg1MSAxNTguMTQyMjYxNDggLTUwLjUyODQ4MjMzIDE1MS40OTA3MzQ1NCAtOTAuMTYzMzMwMDggMTIzLjkzNTMwMjczIEMtMTAzLjI0NzkxOTc0IDExNC40NTUxNTQ1NSAtMTE0LjQxMzIyMTc0IDEwMS42OTg1OTQzOCAtMTE3LjYzMjgxMjUgODUuNDE3OTY4NzUgQy0xMTkuNjcyMDE5NTYgNzAuODI0MzM5MDkgLTExNy40MDczNDMxIDU3Ljk4Njc3Mjk5IC0xMDkuMDU4NTkzNzUgNDUuNzY1NjI1IEMtODcuNzI5NjA1MjkgMTguMTEzODEzODcgLTQ2LjU0MTkyODQxIDUuNDcxNTYwNjkgLTEzLjM0MTMwODU5IDAuNjYxMTMyODEgQy04Ljg5MTIzODYzIDAuMTIyOTIzNDcgLTQuNDc4ODE1MDggMC4wMjM5MTQ2NyAwIDAgWiAiIGZpbGw9IiNGREZERkQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDUwMS4wODIwMzEyNSwxNTAuNzk2ODc1KSIvPgo8cGF0aCBkPSJNMCAwIEMxMy40NDA0MDc4NiAxMC4yNDk4MDY1OCAyMS4xMjIwNzgxNyAyMy43NTA0OTU1NSAyNC4yNDYwOTM3NSA0MC4yNDYwOTM3NSBDMjguMDQzODg0MTEgNzcuMTg4MjM2MzcgMTcuNzYwMzA2MDUgMTEzLjU3NDM3MzA3IDAuNjMyODEyNSAxNDYuMDA3ODEyNSBDMC4zMjExODE2NCAxNDYuNjA0NDg3MyAwLjAwOTU1MDc4IDE0Ny4yMDExNjIxMSAtMC4zMTE1MjM0NCAxNDcuODE1OTE3OTcgQy03LjI4ODg5MzY5IDE2MS4wNTA3NzEwNiAtMTYuMjMwOTUxNDUgMTcyLjk2OTM4MDQ0IC0yNi40MTc5Njg3NSAxODMuOTA2MjUgQy0yOC4xNjI0NjQ1NiAxODUuNzg3MDg5MTcgLTI5LjgwMTg2MzE4IDE4Ny43MTM5OTI4MSAtMzEuNDI5Njg3NSAxODkuNjk1MzEyNSBDLTM0LjczNjA4NjQ0IDE5My41NTcyNTgxNCAtMzguNDQyNDk0MTggMTk2Ljc4NjQyNDIzIC00Mi4zNjcxODc1IDIwMC4wMDc4MTI1IEMtNDIuODU3MTkyMzggMjAwLjQxMDE2MTEzIC00My4zNDcxOTcyNyAyMDAuODEyNTA5NzcgLTQzLjg1MjA1MDc4IDIwMS4yMjcwNTA3OCBDLTYzLjc4MjExNDYxIDIxNy40ODg0ODY0NSAtODYuMzk5NDYyODcgMjM0LjE1Njc1NTc2IC0xMTMuMzY3MTg3NSAyMzIuMDA3ODEyNSBDLTEyNy43NTE2MjA5NyAyMzAuMDE5NDI4OCAtMTQwLjQxMjA3MjY1IDIyMS43OTY3OTU1MiAtMTQ5LjM2NzE4NzUgMjEwLjQ4MDQ2ODc1IEMtMTY0LjU3NzUxNTQzIDE4OC4xNTY2OTAwNCAtMTYyLjA2NTU2ODMxIDE1OS4zNTE1NjYxNyAtMTU3LjM2NzE4NzUgMTM0LjAwNzgxMjUgQy0xNTQuNjk5MTY5MDMgMTIwLjE3NjcwNDUzIC0xNTAuNzM3Mzk1NzkgMTA3LjAyNDYwNzAxIC0xNDUuMzY3MTg3NSA5NC4wMDc4MTI1IEMtMTQ1LjA4MDM3MTA5IDkzLjMwMjM3MzA1IC0xNDQuNzkzNTU0NjkgOTIuNTk2OTMzNTkgLTE0NC40OTgwNDY4OCA5MS44NzAxMTcxOSBDLTEzNy41OTgxNzYzIDc1LjIxMjMwMzIzIC0xMjcuMjA4OTUyOSA1OS41NzAxNzYyOSAtMTE1LjM2NzE4NzUgNDYuMDA3ODEyNSBDLTExNC43MjI2NTYyNSA0NS4yNTUgLTExNC4wNzgxMjUgNDQuNTAyMTg3NSAtMTEzLjQxNDA2MjUgNDMuNzI2NTYyNSBDLTExMS4xMTQ0MjgxOCA0MS4xMDMyNzU5NCAtMTA4Ljc1NzE5ODgxIDM4LjU0OTE3OTQ2IC0xMDYuMzY3MTg3NSAzNi4wMDc4MTI1IEMtMTA1Ljg0MjcwMDIgMzUuNDQ5MzI2MTcgLTEwNS4zMTgyMTI4OSAzNC44OTA4Mzk4NCAtMTA0Ljc3NzgzMjAzIDM0LjMxNTQyOTY5IEMtOTUuNDEwNDI1MDMgMjQuNDIzOTE2MTMgLTg1LjQ1MjgzMzg2IDE1LjkxNjI0NjMgLTc0LjM2NzE4NzUgOC4wMDc4MTI1IEMtNzMuMzkxMzY3MTkgNy4yOTc1MzkwNiAtNzIuNDE1NTQ2ODggNi41ODcyNjU2MiAtNzEuNDEwMTU2MjUgNS44NTU0Njg3NSBDLTUxLjA0MzYyNjkzIC04LjA5ODgwOTk2IC0yMS4zODI5NDcwOCAtMTQuNTU5ODk4NDQgMCAwIFogIiBmaWxsPSIjRkRGREZEIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg4MjkuMzY3MTg3NSw1NDQuOTkyMTg3NSkiLz4KPHBhdGggZD0iTTAgMCBDMTQuOTk3MTExMjEgOS45MjMyMzgyNiAyOC4zMDQxOTI0OCAyMS4zNjEzMTc0OSAzOS4zMTI1IDM1LjYyNSBDMzkuODkyNTc4MTIgMzYuMzM5MTQwNjMgNDAuNDcyNjU2MjUgMzcuMDUzMjgxMjUgNDEuMDcwMzEyNSAzNy43ODkwNjI1IEM1OS4zOTQ0NDYzOCA2MC41NDUwNzk5MyA3Mi41MDc4MjY4OSA4Ny41OTk5NTg3MSA4MC42ODc1IDExNS41NjI1IEM4MC45MjY1NDA1MyAxMTYuMzc4MTU0MyA4MS4xNjU1ODEwNSAxMTcuMTkzODA4NTkgODEuNDExODY1MjMgMTE4LjAzNDE3OTY5IEM4NC41NTMwMzA3OSAxMjkuMzYxMDMzODEgODUuNjgwNjIyNzUgMTQwLjU4MTgyNTA3IDg1LjYyNSAxNTIuMzEyNSBDODUuNjIwODEwNTUgMTUzLjUyOTEzMzMgODUuNjE2NjIxMDkgMTU0Ljc0NTc2NjYgODUuNjEyMzA0NjkgMTU1Ljk5OTI2NzU4IEM4NS40NTMwMjI2NCAxNjguNzk4NTk2NjMgODQuODQwODk3NzUgMTgyLjI3MjIyNjk3IDc4LjMxMjUgMTkzLjYyNSBDNzcuODgwNjY0MDYgMTk0LjQ0MDk3NjU2IDc3LjQ0ODgyODEyIDE5NS4yNTY5NTMxMiA3Ny4wMDM5MDYyNSAxOTYuMDk3NjU2MjUgQzcwLjAwNTU4MTcxIDIwOC42NzE4ODE2NSA1OS4yMjIwMTgyNCAyMTcuMzMyMzc0MyA0NS42NjAxNTYyNSAyMjEuOTk2MDkzNzUgQzI4LjQ5MzkxMzYxIDIyNS4yMjEwMjM4MSA3LjIwNjk5ODA2IDIyMC4xNTgxODIxMSAtNy4zODI4MTI1IDIxMC45MTc5Njg3NSBDLTEwLjIyNDE0MTMxIDIwOC45MDM1OTM4NSAtMTIuOTUwNjYzOTcgMjA2Ljc3OTM4MTE4IC0xNS42ODc1IDIwNC42MjUgQy0xNy4wNTUxNDEzNSAyMDMuNTkzNDk2OTIgLTE4LjQyNTEwODc1IDIwMi41NjUwNzM2MyAtMTkuNzk2ODc1IDIwMS41MzkwNjI1IEMtMzAuNjU2MDA3NzEgMTkzLjM4OTYxMDU2IC00MS4wNDA0MjA0NyAxODUuMTcwNjM5OTEgLTQ5LjY4NzUgMTc0LjYyNSBDLTUwLjEwNzI1MDk4IDE3NC4xMjgyMjc1NCAtNTAuNTI3MDAxOTUgMTczLjYzMTQ1NTA4IC01MC45NTk0NzI2NiAxNzMuMTE5NjI4OTEgQy04My4wNDMyNTEyMSAxMzUuMTIxMjc1NTIgLTEwMi44MzgzNTgyOSA4Ni43NjM2NTc2NCAtOTkuNjg3NSAzNi42MjUgQy05OC4xMjY1MzI3NSAyMC4wNTcwMTIxMyAtOTEuMjAwMTIyMyA1LjI0OTUyNjk2IC03OS4yNSAtNi4yOTY4NzUgQy01NC41NDAxMDQwNCAtMjYuMzM1OTk3OTUgLTIzLjgwNTA2OTMgLTE0LjYyODA0MjU4IDAgMCBaICIgZmlsbD0iI0ZERkRGRCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNzY4LjY4NzUsMjY3LjM3NSkiLz4KPHBhdGggZD0iTTAgMCBDMjkuMTY4ODQzMjcgNi4zODc5NzY2OCAyOS4xNjg4NDMyNyA2LjM4Nzk3NjY4IDM3IDEyIEMzOC4wMTA2MjUgMTIuNzIxODc1IDM5LjAyMTI1IDEzLjQ0Mzc1IDQwLjA2MjUgMTQuMTg3NSBDNDAuNzAxODc1IDE0Ljc4NTYyNSA0MS4zNDEyNSAxNS4zODM3NSA0MiAxNiBDNDIgMTYuNjYgNDIgMTcuMzIgNDIgMTggQzI2LjcyNTE3Mzc2IDE3LjY5MjI2NTQxIDE0LjAzMzI0ODYyIDEyLjA3NTkyNDgxIDIgMyBDMS4zNCAyLjAxIDAuNjggMS4wMiAwIDAgWiAiIGZpbGw9IiNGN0U1RUYiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDc1Miw0NzApIi8+CjxwYXRoIGQ9Ik0wIDAgQy01LjU4MjI1MDE1IDYuNTEyNjI1MTggLTEzLjYyMjg0MzU0IDEwLjM4MzM1NTc3IC0yMiAxMiBDLTI3LjQ4NjAwMDU4IDEyLjMwMTY5MDM0IC0zMi42Mjc0MjgxMiAxMi4yMTIyMjI5IC0zOCAxMSBDLTM1LjMwNTM2ODYxIDguMzA1MzY4NjEgLTMyLjI1MTIxNyA3LjY3OTk1MjcyIC0yOC42ODc1IDYuNjI1IEMtMjcuMjM0MzEyNzcgNi4xODY0MDQwNiAtMjUuNzgxMTg4NjQgNS43NDc1OTg5NyAtMjQuMzI4MTI1IDUuMzA4NTkzNzUgQy0yMy42MDA0NDkyMiA1LjA5MDU4MTA1IC0yMi44NzI3NzM0NCA0Ljg3MjU2ODM2IC0yMi4xMjMwNDY4OCA0LjY0Nzk0OTIyIEMtMjAuMTcyOTQwMDggNC4wNTI3ODA5MyAtMTguMjM0MTk1NTUgMy40MjA3MTE4MyAtMTYuMjk2ODc1IDIuNzg1MTU2MjUgQy0xMC42ODc4NzI5NSAwLjk1MjQ0NzQ0IC01LjkxNzIwNjMgLTAuNTUwNDM3OCAwIDAgWiAiIGZpbGw9IiNGN0UzRUUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDgzMyw0NzgpIi8+Cjwvc3ZnPgo=";

export const SUCCESS_PAGE = `
  <html>
    <head>
      <title>Refresh Successful</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          background: linear-gradient(135deg, #b30059, #b30059);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }

        .container {
          background-color: white;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
          text-align: center;
          max-width: 500px;
          width: 90%;
        }

        .logo {
          margin-bottom: 30px;
          width: 80px;
        }

        .success {
          color: #b30059;
          font-size: 22px;
          margin-bottom: 20px;
        }

        .button {
          padding: 10px 25px;
          font-size: 16px;
          cursor: pointer;
          background: #e6007a;
          color: white;
          border: none;
          border-radius: 6px;
          transition: background 0.3s;
        }

        .button:hover {
          background: #c40069;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <img class="logo" alt="Polkadot Logo" src="${POLKADOT_LOGO}" />
        <div class="success">ReadyToVote transactions were sent to Mimir!</div>
        <button class="button" onclick="window.close()">Close Window</button>
      </div>
    </body>
  </html>
`;
