-- CreateTable
CREATE TABLE "User" (
    "id" CHAR(27) NOT NULL DEFAULT ksuid_pgcrypto_micros(),
    "username" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Challenge" (
    "id" CHAR(27) NOT NULL DEFAULT ksuid_pgcrypto_micros(),
    "userId" CHAR(27) NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),

    CONSTRAINT "Challenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Authenticator" (
    "id" CHAR(27) NOT NULL DEFAULT ksuid_pgcrypto_micros(),
    "userId" CHAR(27) NOT NULL,
    "publicKey" BYTEA NOT NULL,
    "counter" BIGINT NOT NULL,
    "transports" TEXT,

    CONSTRAINT "Authenticator_pkey" PRIMARY KEY ("id")
);
