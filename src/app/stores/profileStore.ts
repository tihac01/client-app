import { makeAutoObservable, reaction, runInAction } from "mobx";
import { Photo, Profile, UserActivity } from "../models/profile";
import agent from "../api/agent";
import { store } from "./sotre";

export default class ProfileStore{
    profile: Profile | null = null;
    loadingProfile = false;
    uploading = false;
    loading = false;
    followings: Profile[] = [];
    loadingFollowings = false;
    activeTab = 0;
    loadingActivities = false;
    userActivities: UserActivity[] = [];

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.activeTab,
            activeTab => {
                if (activeTab === 3 || activeTab === 4) {
                    const predicate = activeTab === 3 ? 'followers' : 'following';
                    this.loadFollowings(predicate);
                } else {
                    this.followings = [];
                }
            }
        )
    }

    setActiveTab = (activeTab: number) => {
        this.activeTab = activeTab;
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

    loadUserActivities = async (userName: string, predicate?: string) => {
        this.loadingActivities = true 
        try {
            const userActivities = await agent.Profiles.listActivitiesForUser(userName, predicate!)
            runInAction(() => this.userActivities = userActivities as UserActivity[])
        } catch (error) {
            console.log(error)
        } finally{
            runInAction(() => {
                this.loadingActivities = false;
            })
        }
    }

    updateProfile = async (profile: Partial<Profile>) => {
        this.loading = true;
        try {
            await agent.Profiles.updateProfile(profile);
            runInAction(() => {
                if (profile.displayName && profile.displayName !==
                    store.userStore.user?.displayName) {
                    store.userStore.setDisplayName(profile.displayName);
                }
                this.profile = { ...this.profile, ...profile as Profile };
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.loading = false);
        }
    }

    uploadPhoto = async (file: Blob) => {
    this.uploading = true
    try {
        const response = await agent.Profiles.uploadPhoto(file);
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

    loadFollowings = async (predicate: string) => {
        this.loadingFollowings = true;
        try {
            const followings = await agent.Profiles.listFollowings(this.profile!.userName, predicate);
            runInAction(() => {
                this.followings = followings;
                this.loadingFollowings = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.loadingFollowings = false);
        }
    }
}