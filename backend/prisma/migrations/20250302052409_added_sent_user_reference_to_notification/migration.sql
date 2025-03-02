-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_sent_user_id_fkey" FOREIGN KEY ("sent_user_id") REFERENCES "Profile"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
