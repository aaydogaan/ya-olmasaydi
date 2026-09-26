FROM node:22-alpine

WORKDIR /app

# 1. Paket tanımlarını kopyala
COPY package.json ./

# 2. Paketleri temiz ve sorunsuz kur
RUN npm install

# 3. Tüm kaynak kodları kopyala
COPY . .

# 4. Projeyi derle
RUN npm run build

# 5. Port ve ortam ayarları
EXPOSE 3000
ENV PORT=3000
ENV HOST=0.0.0.0
ENV NODE_ENV=production

# 6. Başlat
CMD ["npm", "start"]
