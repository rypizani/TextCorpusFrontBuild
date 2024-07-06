import { UserRepository } from './../../repository/User/UserRepository';
import { User } from "../../entity/user/User";
import UserStorage from "../../util/UserStorage";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export class UserService {
    public static async get(): Promise<User> {
        const token = UserStorage.getToken();
        if (!token) {
            const message = 'Token não encontrado. Por favor, faça login.';
            toast.error(message);
            throw new Error(message);
        }

        try {
            const userData = await UserRepository.getUser(token);
            return new User(userData);
        } catch (error: any) {
            this.handleError(error);
        }
    }


    public static async getByID(): Promise<User> {
        const token = UserStorage.getToken();
        if (!token) {
            const message = 'Token não encontrado. Por favor, faça login.';
            toast.error(message);
            throw new Error(message);
        }

        const userId = UserStorage.getUserId();
        if (!userId) {
            const message = 'ID do usuário não encontrado no token.';
            toast.error(message);
            throw new Error(message);
        }

        try {
            const userData = await UserRepository.getUserById(userId, token);
            return new User(userData);
        } catch (error: any) {
            this.handleError(error);
        }
    }

    public static async update(user: User): Promise<User> {
        const token = UserStorage.getToken();
        if (!token) {
            const message = 'Token não encontrado. Por favor, faça login.';
            toast.error(message);
            throw new Error(message);
        }

        const userId = UserStorage.getUserId();
        if (!userId) {
            const message = 'ID do usuário não encontrado no token.';
            toast.error(message);
            throw new Error(message);
        }

        user.id_user = userId; // Assegurar que o ID do usuário é o que está no token

        try {
            const updatedUserData = await UserRepository.updateUser(user, token);
            toast.success('Usuário atualizado com sucesso!');
            return new User(updatedUserData);
        } catch (error: any) {
            this.handleError(error);
        }
    }

    public static async delete(): Promise<void> {
        const token = UserStorage.getToken();
        if (!token) {
            const message = 'Token não encontrado. Por favor, faça login.';
            toast.error(message);
            throw new Error(message);
        }

        const userId = UserStorage.getUserId();
        if (!userId) {
            const message = 'ID do usuário não encontrado no token.';
            toast.error(message);
            throw new Error(message);
        }

        try {
            await UserRepository.deleteUser(userId, token);
            toast.success('Usuário deletado com sucesso!');
        } catch (error: any) {
            this.handleError(error);
        }
    }

    private static handleError(error: any): never {
        if (error.response) {
            let message = 'Ocorreu um erro desconhecido.';
            switch (error.response.status) {
                case 400:
                    message = error.response.data.message || 'Erro de validação.';
                    break;
                case 401:
                    message = error.response.data.message || 'Não autorizado.';
                    break;
                case 404:
                    message = error.response.data.message || 'Recurso não encontrado.';
                    break;
                case 500:
                    message = error.response.data.message || 'Erro no servidor.';
                    break;
                default:
                    message = error.response.data.message || 'Ocorreu um erro desconhecido.';
                    break;
            }
            toast.error(message);
            throw new Error(message);
        } else {
            const message = error.message || 'Ocorreu um erro desconhecido.';
            toast.error(message);
            throw new Error(message);
        }
    }
}