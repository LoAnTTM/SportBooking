import {
  ADD_MEDIA_TO_CLUB_PATH, ADD_MEDIA_TO_UNIT_PATH, REMOVE_MEDIA_FROM_CLUB_PATH,
  REMOVE_MEDIA_FROM_UNIT_PATH, UPLOAD_MEDIA_PATH
} from '@/constants';
import { ResponseError } from '@/helpers/error';
import { apiFactory, ApiResponse } from '@/services/http';
import { MediaModel } from '@/types/model';

import { CreateMediaResponse } from './types';

// Define a type for React Native image file
export interface RNImageFile {
  uri: string;
  type: string;
  name: string;
}

export interface IMediaService {
  upload(
    file: RNImageFile | File
  ): Promise<ApiResponse<MediaModel> | ResponseError>;

  addMediaToClub(
    clubId: string,
    media: MediaModel
  ): Promise<ApiResponse<CreateMediaResponse> | ResponseError>;

  removeMediaFromClub(
    mediaId: string
  ): Promise<ApiResponse<null> | ResponseError>;

  addMediaToUnit(
    unitId: string,
    media: MediaModel
  ): Promise<ApiResponse<CreateMediaResponse> | ResponseError>;

  removeMediaFromUnit(
    mediaId: string
  ): Promise<ApiResponse<null> | ResponseError>;
}

class MediaService implements IMediaService {
  public async upload(
    file: RNImageFile | File
  ): Promise<ApiResponse<MediaModel> | ResponseError> {
    const formData = new FormData();

    // Handle React Native file object differently
    if ('uri' in file) {
      // For React Native, we need to append the file with specific structure
      formData.append('file', {
        uri: file.uri,
        type: file.type,
        name: file.name,
      } as any);
    } else {
      // For web File object
      formData.append('file', file);
    }

    console.log('Uploading file with FormData:', formData);
    return await apiFactory(UPLOAD_MEDIA_PATH).post<MediaModel>(formData);
  }

  public async addMediaToClub(
    clubId: string,
    media: MediaModel
  ): Promise<ApiResponse<CreateMediaResponse> | ResponseError> {
    return await apiFactory(ADD_MEDIA_TO_CLUB_PATH)
      .addPathParam(':clubId', clubId)
      .post<CreateMediaResponse>(media);
  }

  public async removeMediaFromClub(
    mediaId: string
  ): Promise<ApiResponse<null> | ResponseError> {
    return await apiFactory(REMOVE_MEDIA_FROM_CLUB_PATH)
      .addPathParam(':mediaId', mediaId)
      .delete<null>();
  }

  public async addMediaToUnit(
    unitId: string,
    media: MediaModel
  ): Promise<ApiResponse<CreateMediaResponse> | ResponseError> {
    return await apiFactory(ADD_MEDIA_TO_UNIT_PATH)
      .addPathParam(':unitId', unitId)
      .post<CreateMediaResponse>(media);
  }

  public async removeMediaFromUnit(
    mediaId: string
  ): Promise<ApiResponse<null> | ResponseError> {
    return await apiFactory(REMOVE_MEDIA_FROM_UNIT_PATH)
      .addPathParam(':mediaId', mediaId)
      .delete<null>();
  }
}

const mediaService = new MediaService();
export default mediaService;
