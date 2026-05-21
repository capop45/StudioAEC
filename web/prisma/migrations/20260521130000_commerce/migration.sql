-- CreateEnum
CREATE TYPE "CommerceOrderStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'EXPIRED', 'REFUNDED');

-- AlterTable
ALTER TABLE "users" ADD COLUMN "stripe_customer_id" TEXT;

-- AlterTable
ALTER TABLE "courses" ADD COLUMN "purchasable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "price_cents" INTEGER,
ADD COLUMN "currency" TEXT NOT NULL DEFAULT 'brl',
ADD COLUMN "stripe_product_id" TEXT,
ADD COLUMN "stripe_price_id" TEXT;

-- CreateTable
CREATE TABLE "commerce_orders" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "stripe_checkout_session_id" TEXT,
    "stripe_payment_intent_id" TEXT,
    "amount_cents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'brl',
    "status" "CommerceOrderStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "commerce_orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_stripe_customer_id_key" ON "users"("stripe_customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "courses_stripe_product_id_key" ON "courses"("stripe_product_id");

-- CreateIndex
CREATE UNIQUE INDEX "courses_stripe_price_id_key" ON "courses"("stripe_price_id");

-- CreateIndex
CREATE UNIQUE INDEX "commerce_orders_stripe_checkout_session_id_key" ON "commerce_orders"("stripe_checkout_session_id");

-- CreateIndex
CREATE UNIQUE INDEX "commerce_orders_stripe_payment_intent_id_key" ON "commerce_orders"("stripe_payment_intent_id");

-- CreateIndex
CREATE INDEX "commerce_orders_user_id_idx" ON "commerce_orders"("user_id");

-- CreateIndex
CREATE INDEX "commerce_orders_course_id_idx" ON "commerce_orders"("course_id");

-- CreateIndex
CREATE INDEX "commerce_orders_status_idx" ON "commerce_orders"("status");

-- AddForeignKey
ALTER TABLE "commerce_orders" ADD CONSTRAINT "commerce_orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commerce_orders" ADD CONSTRAINT "commerce_orders_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
