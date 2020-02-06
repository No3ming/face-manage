import service from './service'
import { AxiosResponse } from 'axios'

export declare module pose {
  interface IMaterial {
    oss: string
    storage: string
    bucket: string
    skinLevel: number
    // eslint-disable-next-line camelcase
    url_remote: string
    // eslint-disable-next-line camelcase
    url_local: string
  }
  interface IPose {
    poseID: string
    nick: string
    race: string
    gender: string
    model: string
    material: IMaterial
  }
  export interface IPoseJson {
    version: string
    oss: string
    // eslint-disable-next-line camelcase
    body_storage: string
    // eslint-disable-next-line camelcase
    mesh_storage: string
    bucket: string
    body: IPose[]
  }
}

export declare module face {
  interface ITemplate {
    skinLevel: number
    // eslint-disable-next-line camelcase
    model_head: string
    // eslint-disable-next-line camelcase
    face_mask_fusion: string
    // eslint-disable-next-line camelcase
    face_mask_render: string
    // eslint-disable-next-line camelcase
    head_mask: string
  }
  interface IFace {
    name: string
    thumbnail: string
    typeID: number
    // eslint-disable-next-line camelcase
    landmark_68: string
    // eslint-disable-next-line camelcase
    landmark_100: string
    template: ITemplate[]
  }
  interface IFaceJson {
    version: string
    female: IFace[]
    male: IFace[]
  }
  interface IParames {
    limit: number
    offset: number
  }
}
interface ILoginBody {
  username: string
  password: string
}

export default {
  login (body: ILoginBody) {
    return service.post('/author/login', body)
  },
  getPose (parames?: any) {
    return service.get('/pose/json', parames)
  },
  patchPose (body: pose.IPoseJson) {
    return service.patch('/pose/json', body)
  },
  getFaces (parames: face.IParames) {
    return service.get('/face/json', parames)
  },
  putFace (version: string, body: face.IFaceJson) {
    return service.put(`/face/json/${version}`, body)
  },
  postFace (body: face.IFaceJson) {
    return service.post('/face/json', body)
  }
}
