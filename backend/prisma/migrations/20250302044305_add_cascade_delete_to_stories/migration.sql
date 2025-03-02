-- DropForeignKey
ALTER TABLE "StoryViews" DROP CONSTRAINT "StoryViews_story_id_fkey";

-- AddForeignKey
ALTER TABLE "StoryViews" ADD CONSTRAINT "StoryViews_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "Stories"("story_id") ON DELETE CASCADE ON UPDATE CASCADE;
