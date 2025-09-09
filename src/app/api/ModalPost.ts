import axios, {AxiosInstance} from 'axios';
import {ICalcModal} from "@/app/api/ModalInterface/ICalcModal";
import {IPlanModal} from "@/app/api/ModalInterface/IPlanModal";
import {IServiceModal} from "@/app/api/ModalInterface/IServiceModal";

const MODAL_URL = '/api'

export const createApiInstance = (
    baseURL: string,
): AxiosInstance => {
    return axios.create({
        baseURL: baseURL
    });
};

const modal = createApiInstance(MODAL_URL);

export default class ModalService {
    static async caclPost({place, square, type, name, phone}: {
        place?: string,
        square: string,
        type: string,
        name: string,
        phone: string
    }): Promise<void> {
        await modal.post<ICalcModal>('/calc', {place, square, type, name, phone});
    }

    static async planPost(projectType: string, name: string, phone: string): Promise<void> {
        await modal.post<IPlanModal>('/layout', {projectType, name, phone});
    }

    static async servicePost(service: 'Ремонт' | 'Стройка', type: string, name: string, phone: string): Promise<void> {
        await modal.post<IServiceModal>('/service', {service, name, type, phone});
    }

}