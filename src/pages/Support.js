import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  EnvelopeIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import useAlert from "../hooks/useAlert";
import Alert from "../components/Alert";
import emailjs from 'emailjs-com';

function Support() {
  const navigate = useNavigate();
  const { alert, showError, showSuccess, hideAlert } = useAlert();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Inicializar EmailJS
  useEffect(() => {
    emailjs.init("tzJUfTtgfI_RVwVYQ");
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      showError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showError("Por favor, insira um email válido.");
      return;
    }

    setLoading(true);

    try {
      // Configuração do EmailJS
      const templateParams = {
        to_email: 'marlon.oymi@gmail.com',
        from_name: `${formData.firstName} ${formData.lastName}`,
        from_email: formData.email,
        subject: `Suporte ControlFin - ${formData.subject}`,
        message: formData.message,
        reply_to: formData.email
      };

      // Enviar email usando EmailJS
      await emailjs.send(
        'service_cvq7rm8', // Service ID do Gmail
        'template_llz0wxs', // Template ID criado
        templateParams,
        'tzJUfTtgfI_RVwVYQ' // User ID do EmailJS
      );
      
      showSuccess('Mensagem enviada com sucesso! Entraremos em contato em breve.');
      setSubmitted(true);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      showError("Erro ao enviar mensagem. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Suporte
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Entre em contato conosco
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircleIcon className="w-16 h-16 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Mensagem Enviada!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Obrigado por entrar em contato conosco. Sua mensagem foi enviada com sucesso e responderemos em breve.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Enviar Nova Mensagem
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Suporte
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Entre em contato conosco
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Informações de Contato
            </h2>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <ChatBubbleLeftRightIcon className="w-5 h-5 text-primary-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    Suporte Técnico
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Estamos aqui para ajudar com dúvidas, sugestões ou problemas
                    técnicos.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <EnvelopeIcon className="w-5 h-5 text-primary-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    Resposta Rápida
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Sua mensagem será respondida em até 24 horas em dias úteis.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <UserIcon className="w-5 h-5 text-primary-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    Equipe ControlFin
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Nossa equipe especializada está pronta para ajudar você.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">
              Envie sua Mensagem
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Nome *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Seu nome"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Sobrenome *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Seu sobrenome"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Assunto *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Selecione um assunto</option>
                  <option value="Dúvida sobre funcionalidade">
                    Dúvida sobre funcionalidade
                  </option>
                  <option value="Problema técnico">Problema técnico</option>
                  <option value="Sugestão de melhoria">
                    Sugestão de melhoria
                  </option>
                  <option value="Relatório de bug">Relatório de bug</option>
                  <option value="Solicitação de nova funcionalidade">
                    Solicitação de nova funcionalidade
                  </option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Mensagem *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                  placeholder="Descreva sua dúvida, sugestão ou problema detalhadamente..."
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="w-4 h-4 mr-2" />
                      Enviar Mensagem
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Alert
        show={alert.show}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onConfirm={alert.onConfirm}
        onCancel={alert.onCancel}
        onClose={hideAlert}
      />
    </div>
  );
}

export default Support;
