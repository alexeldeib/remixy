export type Authenticator = {
    id: string;
    userId: string;
    publicKey: Buffer;
    counter: string;
    transports: string | null;
};

export type Challenge = {
    id: string;
    userId: string;
};

export type User = {
    id: string;
    username: string;
};

export type DB = {
    Authenticator: Authenticator;
    Challenge: Challenge;
    User: User;
};
