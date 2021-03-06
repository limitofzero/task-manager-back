// import { BadRequestException, Injectable } from '@nestjs/common';
// import { defer, EMPTY, Observable, of, throwError } from 'rxjs';
// import { catchError, mapTo, mergeMap } from 'rxjs/operators';
// import { User } from '../../../db/entity/user';
// import { TokenService } from '../token/token.service';
// import { MailService } from '../email/mail.service';
// import { UserService } from '../user/user.service';
// import { KeyValueStoreService } from '../redis/key-value-store.service';
//
// @Injectable()
// export class ResetPasswordService {
//   constructor(
//     private readonly userRep: UserService,
//     private readonly mail: MailService,
//     private readonly token: TokenService,
//     private readonly keyStore: KeyValueStoreService
//   ) {
//   }
//
//   public sendResetPasswordLink(email: string): Observable<void> {
//     return defer(() => this.userRep.findOneBy({ email })).pipe(
//       mergeMap(user => user ? this.handleForgetPasswordRequest(user) : EMPTY)
//     );
//   }
//
//   public resetPassword(key: string, newPassword: string, repeatNewPassword: string): Observable<void> {
//     return this.keyStore.getAndRemove<string>(key).pipe(
//       mergeMap(token => {
//         if (token) {
//           return this.token.verifyJWT<{ email: string }>(token);
//         } else {
//           return throwError(new BadRequestException('Link is expired'));
//         }
//       }),
//       catchError(error => {
//         throw new BadRequestException(error);
//       }),
//       mergeMap(({ email }) => this.userRep.findOneBy({ email })),
//       mergeMap(user => {
//         if (user) {
//           return of(user);
//         }
//
//         return throwError(new BadRequestException('Email is invalid'));
//       }),
//       mergeMap(user => {
//         if (repeatNewPassword !== newPassword) {
//           return throwError(new BadRequestException('Passwords fields are not equal'));
//         }
//
//         user.password = newPassword;
//         user.hashPassword();
//         return this.userRep.save(user);
//       }),
//       mapTo(null)
//     );
//   }
//
//   private handleForgetPasswordRequest(user: User): Observable<void> {
//     return this.mail.sendResetPasswordEmail(user);
//   }
// }
