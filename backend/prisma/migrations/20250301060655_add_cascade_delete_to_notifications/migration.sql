-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Posts"("post_id") ON DELETE CASCADE ON UPDATE CASCADE;
