-- CreateEnum
CREATE TYPE "Account" AS ENUM ('PRIVATE', 'PUBLIC');

-- CreateEnum
CREATE TYPE "PostsType" AS ENUM ('VIDEO', 'IMAGE');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('LIKE', 'COMMENT');

-- CreateTable
CREATE TABLE "Profile" (
    "user_id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT,
    "mailId" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "bio" TEXT,
    "account" "Account" NOT NULL,
    "location_id" INTEGER NOT NULL,
    "following" INTEGER NOT NULL,
    "followers" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Location" (
    "location_id" SERIAL NOT NULL,
    "State" TEXT NOT NULL,
    "Country" TEXT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("location_id")
);

-- CreateTable
CREATE TABLE "Posts" (
    "post_id" SERIAL NOT NULL,
    "post_bio" TEXT,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "PostsType" NOT NULL,
    "CDNURL" TEXT NOT NULL,
    "totalLikes" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Posts_pkey" PRIMARY KEY ("post_id")
);

-- CreateTable
CREATE TABLE "Stories" (
    "story_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "CDNURL" TEXT NOT NULL,
    "type" "PostsType" NOT NULL,

    CONSTRAINT "Stories_pkey" PRIMARY KEY ("story_id")
);

-- CreateTable
CREATE TABLE "Comments" (
    "comment_id" SERIAL NOT NULL,
    "comment" TEXT NOT NULL,
    "post_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comments_pkey" PRIMARY KEY ("comment_id")
);

-- CreateTable
CREATE TABLE "Likes" (
    "like_id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Likes_pkey" PRIMARY KEY ("like_id")
);

-- CreateTable
CREATE TABLE "StoryViews" (
    "viewed_id" SERIAL NOT NULL,
    "story_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "StoryViews_pkey" PRIMARY KEY ("viewed_id")
);

-- CreateTable
CREATE TABLE "Connections" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "following_user_id" INTEGER NOT NULL,
    "started_following" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Connections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notifications" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "type" "NotificationType" NOT NULL,
    "sent_user_id" INTEGER NOT NULL,
    "post_id" INTEGER NOT NULL,
    "user_viewed" BOOLEAN NOT NULL DEFAULT false,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_username_key" ON "Profile"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_mailId_key" ON "Profile"("mailId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_mobile_key" ON "Profile"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "Location_State_key" ON "Location"("State");

-- CreateIndex
CREATE UNIQUE INDEX "Location_Country_key" ON "Location"("Country");

-- CreateIndex
CREATE INDEX "Posts_user_id_idx" ON "Posts"("user_id");

-- CreateIndex
CREATE INDEX "Stories_user_id_idx" ON "Stories"("user_id");

-- CreateIndex
CREATE INDEX "Comments_post_id_idx" ON "Comments"("post_id");

-- CreateIndex
CREATE INDEX "Likes_post_id_idx" ON "Likes"("post_id");

-- CreateIndex
CREATE INDEX "StoryViews_story_id_idx" ON "StoryViews"("story_id");

-- CreateIndex
CREATE INDEX "Connections_user_id_idx" ON "Connections"("user_id");

-- CreateIndex
CREATE INDEX "Notifications_user_id_idx" ON "Notifications"("user_id");

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Profile"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Posts"("post_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Profile"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Posts"("post_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Profile"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryViews" ADD CONSTRAINT "StoryViews_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "Stories"("story_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryViews" ADD CONSTRAINT "StoryViews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Profile"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
