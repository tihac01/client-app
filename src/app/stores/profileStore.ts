import { makeAutoObservable, runInAction } from "mobx";
import { Photo, Profile } from "../models/profile";
import agent from "../api/agent";
import { store } from "./sotre";

export default class ProfileStore{
    profile: Profile | null = null;
    loadingProfile = false;
    uploading = false;
    loading = false;
    followings: Profile[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    get isCurrentUser() {
        if (store.userStore.user && this.profile)
            return store.userStore.user.userName === this.profile.userName
        return false
    }

    loadProfile = async (userName: string) => {
        this.loadingProfile = true 
        try {
            const profile = await agent.Profiles.get(userName)
            runInAction(() => this.profile = profile)
        } catch (error) {
            console.log(error)
        } finally{
            runInAction(() => {
                this.loadingProfile = false;
            })
        }
    } 

    uploadPhoto = async (file: Blob) => {
    this.uploading = true
    try {
        const response =await agent.Profiles.uploadPhoto(file);
        const photo = response.data;
        runInAction(() => {
            if (this.profile) {
                this.profile.photos?.push(photo);
                if (photo.isMain && store.userStore.user) {
                    store.userStore.setImage(photo.url)
                    this.profile.image = photo.url
                }
            }            
        })        
    } catch (error) {
            console.log(error)
    } finally{
            runInAction(() => {
                this.uploading = false;
            })
        }
    }

    setMainPhoto = async (photo:Photo) => {
        this.loading = (true)
        try {
           await agent.Profiles.setMainPhoto(photo.photoId)
           store.userStore.setImage(photo.url)
           runInAction(() => {
            if (this.profile && this.profile.photos){
                this.profile.photos.find(p => p.isMain)!.isMain = false;
                this.profile.photos.find(p => p.photoId === photo.photoId)!.isMain = true;
                this.profile.image = photo.url
            }
           })
        } catch (error) {
                console.log(error)
        } finally{
                runInAction(() => {
                    this.loading = false;
                })
            }
    }

    deletePhoto = async (id: string) => {
        this.loading = (true)
        try {
           await agent.Profiles.deletePhoto(id)
           runInAction(() => {
            if (this.profile) {
                this.profile.photos = this.profile.photos?.filter(p => p.photoId !== id)
            }

           })
        } catch (error) {
                console.log(error)
        } finally{
                runInAction(() => {
                    this.loading = false;
                })
            }
    }
    
    updateFollowing = async (username: string, following: boolean) => {
        this.loading = true;
        try {
            await agent.Profiles.updateFollowing(username);
            store.activityStore.updateAttendeeFollowing(username);
            runInAction(() => {
                // Update the main profile
                if (this.profile 
                    && this.profile.userName !== store.userStore.user?.userName
                    && this.profile.userName === username) {
                    if (following) {
                        this.profile.followersCount++;
                    } else {
                        this.profile.followersCount--;
                    }
                    this.profile.following = !this.profile.following;
                }
    
                // Update current user's following count
                if (this.profile && this.profile.userName === store.userStore.user?.userName) {
                    if (following) {
                        this.profile.followingCount++;
                    } else {
                        this.profile.followingCount--;
                    }
                }
    
                // Update followings list
                this.followings.forEach(profile => {
                    if (profile.userName === username) {
                        if (following) {
                            profile.followersCount++;
                        } else {
                            profile.followersCount--;
                        }
                        profile.following = !profile.following;
                    }
                })
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }
}