//package vn.trijava.springrest.controller;
//
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseCookie;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.security.oauth2.jwt.Jwt;
//import org.springframework.web.bind.annotation.CookieValue;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import jakarta.validation.Valid;
//import vn.trijava.springrest.domain.User;
//import vn.trijava.springrest.domain.request.ReqLoginDTO;
//import vn.trijava.springrest.domain.response.ResCreateUserDTO;
//import vn.trijava.springrest.domain.response.ResLoginDTO;
//import vn.trijava.springrest.service.UserService;
//import vn.trijava.springrest.util.SecurityUtil;
//import vn.trijava.springrest.util.annotation.ApiMessage;
//import vn.trijava.springrest.util.error.IdInvalidException;
//
//@RestController
//@RequestMapping("/api/v1")
//public class AuthController {
//
//    private final AuthenticationManagerBuilder authenticationManagerBuilder;
//    private final SecurityUtil securityUtil;
//    private final UserService userService;
//    private final PasswordEncoder passwordEncoder;
//
//    @Value("${cdweb.jwt.refresh-token-validity-in-seconds}")
//    private long refreshTokenExpiration;
//
//    public AuthController(
//            AuthenticationManagerBuilder authenticationManagerBuilder,
//            SecurityUtil securityUtil,
//            UserService userService,
//            PasswordEncoder passwordEncoder) {
//        this.authenticationManagerBuilder = authenticationManagerBuilder;
//        this.securityUtil = securityUtil;
//        this.userService = userService;
//        this.passwordEncoder = passwordEncoder;
//    }
//
//    @PostMapping("/auth/login")
//    public ResponseEntity<ResLoginDTO> login(@Valid @RequestBody ReqLoginDTO loginDto) {
//        // Nạp input gồm username/password vào Security
//        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
//                loginDto.getUsername(), loginDto.getPassword());
//
//        // xác thực người dùng => cần viết hàm loadUserByUsername
//        Authentication authentication = authenticationManagerBuilder.getObject()
//                .authenticate(authenticationToken);
//
//        // set thông tin người dùng đăng nhập vào context (có thể sử dụng sau này)
//        SecurityContextHolder.getContext().setAuthentication(authentication);
//
//        ResLoginDTO res = new ResLoginDTO();
//        User currentUserDB = this.userService.handleGetUserByUsername(loginDto.getUsername());
//        if (currentUserDB != null) {
//            ResLoginDTO.UserLogin userLogin = new ResLoginDTO.UserLogin(
//                    currentUserDB.getId(),
//                    currentUserDB.getEmail(),
//                    currentUserDB.getName(),
//                    currentUserDB.getRole());
//            res.setUser(userLogin);
//        }
//
//        // create access token
//        String access_token = this.securityUtil.createAccessToken(authentication.getName(), res);
//        res.setAccessToken(access_token);
//
//        // create refresh token
//        String refresh_token = this.securityUtil.createRefreshToken(loginDto.getUsername(), res);
//
//        // update user
//        this.userService.updateUserToken(refresh_token, loginDto.getUsername());
//
//        // set cookies
//        ResponseCookie resCookies = ResponseCookie
//                .from("refresh_token", refresh_token)
//                .httpOnly(true)
//                .secure(true)
//                .path("/")
//                .maxAge(refreshTokenExpiration)
//                .build();
//
//        return ResponseEntity.ok()
//                .header(HttpHeaders.SET_COOKIE, resCookies.toString())
//                .body(res);
//    }
//
//    @GetMapping("/auth/account")
//    @ApiMessage("fetch account")
//    public ResponseEntity<ResLoginDTO.UserGetAccount> getAccount() {
//        String email = SecurityUtil.getCurrentUserLogin().isPresent()
//                ? SecurityUtil.getCurrentUserLogin().get()
//                : "";
//
//        User currentUserDB = this.userService.handleGetUserByUsername(email);
//        ResLoginDTO.UserLogin userLogin = new ResLoginDTO.UserLogin();
//        ResLoginDTO.UserGetAccount userGetAccount = new ResLoginDTO.UserGetAccount();
//
//        if (currentUserDB != null) {
//            userLogin.setId(currentUserDB.getId());
//            userLogin.setEmail(currentUserDB.getEmail());
//            userLogin.setName(currentUserDB.getName());
//            userLogin.setRole(currentUserDB.getRole());
//
//            userGetAccount.setUser(userLogin);
//        }
//
//        return ResponseEntity.ok().body(userGetAccount);
//    }
//
//    @GetMapping("/auth/refresh")
//    @ApiMessage("Get User by refresh token")
//    public ResponseEntity<ResLoginDTO> getRefreshToken(
//            @CookieValue(name = "refresh_token", defaultValue = "abc") String refresh_token) throws IdInvalidException {
//        if (refresh_token.equals("abc")) {
//            throw new IdInvalidException("Bạn không có refresh token ở cookie");
//        }
//        // check valid
//        Jwt decodedToken = this.securityUtil.checkValidRefreshToken(refresh_token);
//        String email = decodedToken.getSubject();
//
//        // check user by token + email
//        User currentUser = this.userService.getUserByRefreshTokenAndEmail(refresh_token, email);
//        if (currentUser == null) {
//            throw new IdInvalidException("Refresh Token không hợp lệ");
//        }
//
//        // issue new token/set refresh token as cookies
//        ResLoginDTO res = new ResLoginDTO();
//        User currentUserDB = this.userService.handleGetUserByUsername(email);
//        if (currentUserDB != null) {
//            ResLoginDTO.UserLogin userLogin = new ResLoginDTO.UserLogin(
//                    currentUserDB.getId(),
//                    currentUserDB.getEmail(),
//                    currentUserDB.getName(),
//                    currentUserDB.getRole());
//            res.setUser(userLogin);
//        }
//
//        // create access token
//        String access_token = this.securityUtil.createAccessToken(email, res);
//        res.setAccessToken(access_token);
//
//        // create refresh token
//        String new_refresh_token = this.securityUtil.createRefreshToken(email, res);
//
//        // update user
//        this.userService.updateUserToken(new_refresh_token, email);
//
//        // set cookies
//        ResponseCookie resCookies = ResponseCookie
//                .from("refresh_token", new_refresh_token)
//                .httpOnly(true)
//                .secure(true)
//                .path("/")
//                .maxAge(refreshTokenExpiration)
//                .build();
//
//        return ResponseEntity.ok()
//                .header(HttpHeaders.SET_COOKIE, resCookies.toString())
//                .body(res);
//    }
//
//    @PostMapping("/auth/logout")
//    @ApiMessage("Logout User")
//    public ResponseEntity<Void> logout() throws IdInvalidException {
//        String email = SecurityUtil.getCurrentUserLogin().isPresent() ? SecurityUtil.getCurrentUserLogin().get() : "";
//
//        if (email.equals("")) {
//            throw new IdInvalidException("Access Token không hợp lệ");
//        }
//
//        // update refresh token = null
//        this.userService.updateUserToken(null, email);
//
//        // remove refresh token cookie
//        ResponseCookie deleteSpringCookie = ResponseCookie
//                .from("refresh_token", null)
//                .httpOnly(true)
//                .secure(true)
//                .path("/")
//                .maxAge(0)
//                .build();
//
//        return ResponseEntity.ok()
//                .header(HttpHeaders.SET_COOKIE, deleteSpringCookie.toString())
//                .body(null);
//    }
//
//    @PostMapping("/auth/register")
//    @ApiMessage("Register a new user")
//    public ResponseEntity<ResCreateUserDTO> register(@Valid @RequestBody User postManUser) throws IdInvalidException {
//        boolean isEmailExist = this.userService.isEmailExist(postManUser.getEmail());
//        if (isEmailExist) {
//            throw new IdInvalidException(
//                    "Email " + postManUser.getEmail() + "đã tồn tại, vui lòng sử dụng email khác.");
//        }
//
//        String hashPassword = this.passwordEncoder.encode(postManUser.getPassword());
//        postManUser.setPassword(hashPassword);
//        User new1User = this.userService.handleCreateUser(postManUser);
//        return ResponseEntity.status(HttpStatus.CREATED).body(this.userService.convertToResCreateUserDTO(new1User));
//    }
//}

package vn.trijava.springrest.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import vn.trijava.springrest.domain.User;
import vn.trijava.springrest.domain.request.ReqLoginDTO;
import vn.trijava.springrest.domain.response.IBackendRes;
import vn.trijava.springrest.domain.response.ResCreateUserDTO;
import vn.trijava.springrest.domain.response.ResLoginDTO;
import vn.trijava.springrest.service.UserService;
import vn.trijava.springrest.util.SecurityUtil;
import vn.trijava.springrest.util.annotation.ApiMessage;
import vn.trijava.springrest.util.error.IdInvalidException;

@RestController
@RequestMapping("/api/v1")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final SecurityUtil securityUtil;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    @Value("${cdweb.jwt.refresh-token-validity-in-seconds}")
    private long refreshTokenExpiration;

    public AuthController(
            AuthenticationManager authenticationManager,
            SecurityUtil securityUtil,
            UserService userService,
            PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.securityUtil = securityUtil;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/auth/login")
    public ResponseEntity<ResLoginDTO> login(@Valid @RequestBody ReqLoginDTO loginDto) {
        System.out.println("Attempting login with username: " + loginDto.getUsername() + ", password: " + loginDto.getPassword()); // Thêm log
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                loginDto.getUsername(), loginDto.getPassword());

        try {
            Authentication authentication = authenticationManager.authenticate(authenticationToken);
            SecurityContextHolder.getContext().setAuthentication(authentication);

            ResLoginDTO res = new ResLoginDTO();
            User currentUserDB = this.userService.handleGetUserByUsername(loginDto.getUsername());
            if (currentUserDB != null) {
                ResLoginDTO.UserLogin userLogin = new ResLoginDTO.UserLogin(
                        currentUserDB.getId(),
                        currentUserDB.getEmail(),
                        currentUserDB.getName(),
                        currentUserDB.getRole());
                res.setUser(userLogin);
            }

            String access_token = this.securityUtil.createAccessToken(authentication.getName(), res);
            res.setAccessToken(access_token);

            String refresh_token = this.securityUtil.createRefreshToken(loginDto.getUsername(), res);

            this.userService.updateUserToken(refresh_token, loginDto.getUsername());

            ResponseCookie resCookies = ResponseCookie
                    .from("refresh_token", refresh_token)
                    .httpOnly(true)
                    .secure(true)
                    .path("/")
                    .maxAge(refreshTokenExpiration)
                    .build();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, resCookies.toString())
                    .body(res);
        } catch (Exception e) {
            System.out.println("Login failed: " + e.getMessage()); // Thêm log lỗi
            throw e;
        }
    }

    @GetMapping("/auth/account")
    @ApiMessage("fetch account")
    public ResponseEntity<ResLoginDTO.UserGetAccount> getAccount() {
        String email = SecurityUtil.getCurrentUserLogin().isPresent()
                ? SecurityUtil.getCurrentUserLogin().get()
                : "";

        User currentUserDB = this.userService.handleGetUserByUsername(email);
        ResLoginDTO.UserLogin userLogin = new ResLoginDTO.UserLogin();
        ResLoginDTO.UserGetAccount userGetAccount = new ResLoginDTO.UserGetAccount();

        if (currentUserDB != null) {
            userLogin.setId(currentUserDB.getId());
            userLogin.setEmail(currentUserDB.getEmail());
            userLogin.setName(currentUserDB.getName());
            userLogin.setRole(currentUserDB.getRole());

            userGetAccount.setUser(userLogin);
        }

        return ResponseEntity.ok().body(userGetAccount);
    }

    @GetMapping("/auth/refresh")
    @ApiMessage("Get User by refresh token")
    public ResponseEntity<ResLoginDTO> getRefreshToken(
            @CookieValue(name = "refresh_token", defaultValue = "abc") String refresh_token) throws IdInvalidException {
        if (refresh_token.equals("abc")) {
            throw new IdInvalidException("Bạn không có refresh token ở cookie");
        }
        Jwt decodedToken = this.securityUtil.checkValidRefreshToken(refresh_token);
        String email = decodedToken.getSubject();

        User currentUser = this.userService.getUserByRefreshTokenAndEmail(refresh_token, email);
        if (currentUser == null) {
            throw new IdInvalidException("Refresh Token không hợp lệ");
        }

        ResLoginDTO res = new ResLoginDTO();
        User currentUserDB = this.userService.handleGetUserByUsername(email);
        if (currentUserDB != null) {
            ResLoginDTO.UserLogin userLogin = new ResLoginDTO.UserLogin(
                    currentUserDB.getId(),
                    currentUserDB.getEmail(),
                    currentUserDB.getName(),
                    currentUserDB.getRole());
            res.setUser(userLogin);
        }

        String access_token = this.securityUtil.createAccessToken(email, res);
        res.setAccessToken(access_token);

        String new_refresh_token = this.securityUtil.createRefreshToken(email, res);

        this.userService.updateUserToken(new_refresh_token, email);

        ResponseCookie resCookies = ResponseCookie
                .from("refresh_token", new_refresh_token)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(refreshTokenExpiration)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, resCookies.toString())
                .body(res);
    }

    @PostMapping("/auth/logout")
    @ApiMessage("Logout User")
    public ResponseEntity<IBackendRes<Void>> logout() throws IdInvalidException {
        String email = SecurityUtil.getCurrentUserLogin().isPresent() ? SecurityUtil.getCurrentUserLogin().get() : "";
        System.out.println("Received logout request for email: " + email);

        if (email.equals("")) {
            System.out.println("Logout failed: Access Token không hợp lệ");
            throw new IdInvalidException("Access Token không hợp lệ");
        }

        this.userService.updateUserToken(null, email);
        System.out.println("Updated refresh token to null for email: " + email);

        // Xóa SecurityContext
        SecurityContextHolder.clearContext();

        ResponseCookie deleteSpringCookie = ResponseCookie
                .from("refresh_token", null)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .build();

        IBackendRes<Void> response = new IBackendRes<>();
        response.setStatus(HttpStatus.OK.value());
        response.setMessage("Đăng xuất thành công");
        response.setData(null);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, deleteSpringCookie.toString())
                .body(response);
    }

    @PostMapping("/auth/register")
    @ApiMessage("Register a new user")
    public ResponseEntity<ResCreateUserDTO> register(@Valid @RequestBody User postManUser) throws IdInvalidException {
        System.out.println("Received password in register: " + postManUser.getPassword());
        boolean isEmailExist = this.userService.isEmailExist(postManUser.getEmail());
        if (isEmailExist) {
            throw new IdInvalidException(
                    "Email " + postManUser.getEmail() + " đã tồn tại, vui lòng sử dụng email khác.");
        }

        this.userService.validatePassword(postManUser.getPassword());

        String hashPassword = this.passwordEncoder.encode(postManUser.getPassword());
        postManUser.setPassword(hashPassword);
        User newUser = this.userService.handleCreateUser(postManUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(this.userService.convertToResCreateUserDTO(newUser));
    }

    @PostMapping("/auth/forgot-password")
    @ApiMessage("Send reset password code")
    public ResponseEntity<IBackendRes<String>> forgotPassword(@RequestParam String email) throws IdInvalidException {
        System.out.println("Received forgot password request for email: " + email);
        userService.sendResetCode(email);
        System.out.println("Reset code sent successfully for email: " + email);
        IBackendRes<String> response = new IBackendRes<>();
        response.setStatus(HttpStatus.OK.value());
        response.setMessage("Mã đặt lại mật khẩu đã được gửi đến email của bạn");
        response.setData(null);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/auth/reset-password")
    @ApiMessage("Reset password")
    public ResponseEntity<IBackendRes<String>> resetPassword(
            @RequestParam String resetCode,
            @RequestParam String newPassword) throws IdInvalidException {
        System.out.println("Received reset password request with resetCode: " + resetCode);
        userService.resetPassword(resetCode, newPassword);
        System.out.println("Password reset successfully for resetCode: " + resetCode);
        IBackendRes<String> response = new IBackendRes<>();
        response.setStatus(HttpStatus.OK.value());
        response.setMessage("Đặt lại mật khẩu thành công");
        response.setData(null);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}