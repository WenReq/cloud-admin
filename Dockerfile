FROM nginx:latest
ADD cloud.conf /etc/nginx/conf.d/cloud.conf
ADD dist /cloudadmin
RUN chown nginx:nginx -R /cloudadmin
EXPOSE 8005
ENTRYPOINT [ "nginx", "-g", "daemon off;"]