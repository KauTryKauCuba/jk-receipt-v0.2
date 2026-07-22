CREATE TABLE "audit_logs" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"timestamp" varchar(50) NOT NULL,
	"category" varchar(50) NOT NULL,
	"action" text NOT NULL,
	"operator" varchar(100) NOT NULL,
	"ip_address" varchar(50) NOT NULL,
	"hash" text NOT NULL,
	"status" varchar(20) DEFAULT 'VERIFIED' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" varchar(50) NOT NULL,
	"merchant" text NOT NULL,
	"date" varchar(20) NOT NULL,
	"amount" double precision NOT NULL,
	"currency" varchar(10) DEFAULT 'MYR' NOT NULL,
	"file_size" varchar(20) NOT NULL,
	"format" varchar(20) NOT NULL,
	"status" varchar(20) DEFAULT 'VERIFIED' NOT NULL,
	"hash" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "receipts" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"merchant" text NOT NULL,
	"category" varchar(50) NOT NULL,
	"date" varchar(20) NOT NULL,
	"amount" double precision NOT NULL,
	"status" varchar(20) DEFAULT 'VERIFIED' NOT NULL,
	"items_count" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"call_sign" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"currency" varchar(10) DEFAULT 'MYR' NOT NULL,
	"auto_tax_tag" varchar(10) DEFAULT 'true' NOT NULL,
	"two_factor_auth" varchar(10) DEFAULT 'true' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
