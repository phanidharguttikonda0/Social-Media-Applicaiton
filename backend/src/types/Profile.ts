import { Request } from "express";
import { number } from "zod";


export interface AuthenticatedRequest extends Request{
    user?: {
        username: string,
        [key: string]:any 
    };
}

export enum Account {
    PRIVATE = "PRIVATE",
    PUBLIC = "PUBLIC"
  }
  
  export enum PostsType {
    VIDEO = "VIDEO",
    IMAGE = "IMAGE"
  }
  
  export enum NotificationType {
    LIKE = "LIKE",
    COMMENT = "COMMENT"
  }
  
  // Profile Type
  export type Profile = {
    user_id: number;
    username: string;
    name?: string;
    mailId: string;
    mobile: string;
    password: string;
    bio?: string;
    account: Account;
    location: Location;
    following: number;
    followers: number;
    profilePictureURL: string;
    time: Date;
    likes: Likes[];
    comments: Comments[];
    Posts: Posts[];
    viewedStories: StoryViews[];
  };
  
  // Location Type
  export type Location = {
    location_id: number;
    State: string;
    Country: string;
  };
  
  // Posts Type
  export type Posts = {
    post_id: number;
    post_bio?: string;
    created_date: Date;
    type: PostsType;
    CDNURL: string;
    totalLikes: number;
    user_id: number;
    user: Profile;
    likes: Likes[];
    comments: Comments[];
  };
  
  // Stories Type
  export type Stories = {
    story_id: number;
    user_id: number;
    created_time: Date;
    CDNURL: string;
    type: PostsType;
    storyViews: StoryViews[];
  };
  
  // Comments Type
  export type Comments = {
    comment_id: number;
    comment: string;
    post_id: number;
    user_id: number;
    created_time: Date;
    post: Posts;
    user: Profile;
  };
  
  // Likes Type
  export type Likes = {
    like_id: number;
    post_id: number;
    user_id: number;
    post: Posts;
    user: Profile;
  };
  
  // StoryViews Type
  export type StoryViews = {
    viewed_id: number;
    story_id: number;
    user_id: number;
    story: Stories;
    user: Profile;
  };
  
  // Connections Type
  export type Connections = {
    id: number;
    user_id: number;
    following_user_id: number;
    started_following: Date;
  };
  
  // Notifications Type
  export type Notifications = {
    id: number;
    user_id: number;
    type: NotificationType;
    sent_user_id: number;
    post_id: number;
    user_viewed: boolean;
    time: Date;
  };
  
