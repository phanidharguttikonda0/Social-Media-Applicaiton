npm install --save-dev typescript ts-node @types/node @types/express prisma

 npm install express @prisma/client dotenv

 npm install zod
 npm install cors
 npm i --save-dev @types/cors

npm install bcrypt


 For every module installed we need to install the @types/library with save dependency

 npx prisma migrate dev --name (name for migration)

 # Things we need to establish

    -> When follow was hit a notification to be addded to notification table, and if the user followed was not private then adding in to the connections table

    -> if the user accepts the follow request then adding to the connections table and then modifying the notifications table.

    -> when user clicks on a post we are going to show the  user profile along with username and the post, and likes count , comments count , bio, when click on the like count we will show list of users liked , clicked on the comments counts shows the list of comments.

    -> helps to change username , mailId, profile picture, bio, password, name

    -> if user unlikes , we are going to delete the notification as well

    -> when clicked on the followers , need to return the followers list, and same for the following, only if the account was public or if the user following the account or if the owner of the user asking it

    -> sign in and sign up




       